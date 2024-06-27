import os
import json
from tqdm.auto import tqdm
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEndpoint
from dotenv import load_dotenv
from huggingface_hub import login
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate
)
from langchain.schema import SystemMessage
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace

load_dotenv()
login(token=os.environ["HUGGINGFACE_TOKEN_V2"])

# Read qa data from file
with open('filter_generated_qa.json', 'r') as f:
    eval_dataset = json.load(f)

# Read data from file
file_name = "data.json"
current_dir = os.getcwd()
file_path = os.path.join(os.path.dirname(current_dir), file_name)
with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

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
        ("human", "{input}")
    ]
)

repo_id = 'mistralai/Mistral-7B-Instruct-v0.3'
llm = HuggingFaceEndpoint(repo_id=repo_id, temperature=0.1, max_length=4096)

history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

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
        ("human", "{input}")
    ]
)

# Define the chain
question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

### Combine the chains ###
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

# Generate QA
outputs = []
verbose = True
for example in tqdm(eval_dataset):
    question = example["question"]
    output = rag_chain.invoke({"input": question})
    answer = ""
    try:
        answer = output["answer"].split(":")[-1].strip()
    except:
        answer = output["answer"]
        
    if verbose:
        print("="*100)
        print(f"Question: {question}")
        print(f"Answer: {answer}")
        print(f"True answer: {example['answer']}")
    result = {
        "question": question,
        "true_answer": example["answer"],
        "generated_answer": answer
    }
    outputs.append(result)

# Evaluate the generated QA
EVALUATION_PROMPT = """###Task Description:
An instruction (might include an Input inside it), a response to evaluate, a reference answer that gets a score of 5, and a score rubric representing a evaluation criteria are given.
1. Write a detailed feedback that assess the quality of the response strictly based on the given score rubric, not evaluating in general.
2. After writing a feedback, write a score that is an integer between 1 and 5. You should refer to the score rubric.
3. The output format should look as follows: \"Feedback: {{write a feedback for criteria}} [RESULT] {{an integer number between 1 and 5}}\"
4. Please do not generate any other opening, closing, and explanations. Be sure to include [RESULT] in your output, MUST be [RESULT], no anything else, always remember this.

###The instruction to evaluate:
{instruction}

###Response to evaluate:
{response}

###Reference Answer (Score 5):
{reference_answer}

###Score Rubrics:
[Is the response correct, accurate, and factual based on the reference answer?]
Score 1: The response is completely incorrect, inaccurate, and/or not factual.
Score 2: The response is mostly incorrect, inaccurate, and/or not factual.
Score 3: The response is somewhat correct, accurate, and/or factual.
Score 4: The response is mostly correct, accurate, and factual.
Score 5: The response is completely correct, accurate, and factual.

###Feedback:"""

evaluation_prompt_template = ChatPromptTemplate.from_messages(
    [
        SystemMessage(content="You are a fair evaluator language model."),
        HumanMessagePromptTemplate.from_template(EVALUATION_PROMPT),
    ]
)

llm = HuggingFaceEndpoint(
    repo_id="meta-llama/Meta-Llama-3-8B-Instruct",
    task="text-generation",
    max_new_tokens=512,
)

eval_chat_model = ChatHuggingFace(llm=llm)

evaluator_name = "Llama-3-8B"
for experiment in tqdm(outputs):
    eval_prompt = evaluation_prompt_template.format_messages(
        instruction=experiment["question"],
        response=experiment["generated_answer"],
        reference_answer=experiment["true_answer"],
    )
    eval_result = eval_chat_model.invoke(eval_prompt)
    feedback, score = [item.strip() for item in eval_result.content.split("[RESULT]")]
    experiment[f"eval_score_{evaluator_name}"] = score
    experiment[f"eval_feedback_{evaluator_name}"] = feedback

# Compute the average score
for example in outputs:
    example["eval_score_Llama-3-8B"] = int(example["eval_score_Llama-3-8B"]) if isinstance(example["eval_score_Llama-3-8B"], str) else 1

with open("results.json", "w") as f:
    json.dump(outputs, f, indent=4, ensure_ascii=False)

average_score = sum([example["eval_score_Llama-3-8B"] for example in outputs]) / len(outputs)
print(f"Average score: {average_score} / 5.0") # 3.38 / 5.0
print(f"Accuracy: {average_score / 5.0 * 100:.2f}%") # 67.60%
