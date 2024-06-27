import uvicorn
from fastapi import FastAPI, Request, Form
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import CSVLoader , JSONLoader
import json
from pathlib import Path
from langchain.embeddings import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.vectorstores import DocArrayInMemorySearch
from huggingface_hub import login
from langchain.llms import HuggingFaceHub
import os
from configparser import ConfigParser
from langchain.embeddings import HuggingFaceEmbeddings,HuggingFaceBgeEmbeddings
import getpass
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.embeddings.sentence_transformer import (
    SentenceTransformerEmbeddings,
)
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEndpoint
from dotenv import load_dotenv

load_dotenv()
login(token=os.environ["HUGGINGFACE_TOKEN"])

# Define file path and template
file_path = 'data.json'
with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f, )

docs = []
for example in data:
    docs.append(Document(page_content=str(example),
                        metadata={"source": file_path}))

# Initialize embeddings, loader, and prompt
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=2000,
    chunk_overlap=200,
    add_start_index=True,
    separators=["\n\n", "\n", ".", " ", ""],
)

splits = text_splitter.split_documents(docs)
embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma.from_documents(documents=splits, embedding=embedding_function)
retriever = vectorstore.as_retriever()

### Contextualize question ###
contextualize_q_system_prompt = (
"Given a chat history and the latest user question "
"which might reference context in the chat history, "
"formulate a standalone question which can be understood "
"without the chat history. Do NOT answer the question, "
"just reformulate it if needed and otherwise return it as is."
)

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ]
)
repo_id = 'mistralai/Mistral-7B-Instruct-v0.3'
llm = HuggingFaceEndpoint(repo_id=repo_id , temperature= 0.1, max_length=4096)

history_aware_retriever = create_history_aware_retriever(
    llm,
    retriever,
    contextualize_q_prompt
)

### Answer question ###
# Define the prompt for the QA system
system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer "
    "the question. If you don't know the answer, say that you "
    "don't know. Use one sentence maximum and combine all relevant information into a single concise answer."
    "\n\n"
    "{context}"
)
# Define the prompt template
qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
        ]
)

# Define the chain
question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

### Combine the chains ###
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

### Statefully manage chat history ###
store = {}

print ('-------------------------------------------------------------------------------------------')
def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer"
)

# Define the FastAPI app
from fastapi import FastAPI, HTTPException, Body
from uuid import uuid4

app = FastAPI()

@app.post("/chat/")
async def chat(input: str = Body(..., embed=True), session_id: str = Body(default=None, embed=True)):
    # Check if session_id is provided, if not generate a new one
    if not session_id:
        session_id = str(uuid4())
    try:
        # Invoke the conversational chain with the provided or generated session ID
        output = conversational_rag_chain.invoke(
            {"input": input},
            config={"configurable": {"session_id": session_id}}
        )["answer"]
        # Return the answer and session ID
        return {"session_id": session_id, "answer": output}
    except Exception as e:
        # Handle errors gracefully
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("test:app", port=8005, log_level="info")