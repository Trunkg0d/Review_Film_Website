from tqdm.auto import tqdm
import json
import os
import random
from dotenv import load_dotenv
from huggingface_hub import login
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from huggingface_hub import InferenceClient
load_dotenv()
login(token=os.environ["HUGGINGFACE_TOKEN_V2"])

# Read data from file
file_name = "data.json"
current_dir = os.getcwd()
file_path = os.path.join(os.path.dirname(current_dir), file_name)
with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Create documents
langchain_docs = []
for example in data:
    langchain_docs.append(Document(page_content=str(example),
                                  metadata={"source": file_path}))

# Split documents 
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=2000,
    chunk_overlap=200,
    add_start_index=True,
    separators=["\n\n", "\n", ".", " ", ""],
)

docs_processed = []
for doc in langchain_docs:
    docs_processed += text_splitter.split_documents([doc])

# Set up the LLM client
repo_id = "mistralai/Mixtral-8x7B-Instruct-v0.1"
llm_client = InferenceClient(
    model=repo_id,
    timeout=120,
)

def call_llm(inference_client: InferenceClient, prompt: str):
    response = inference_client.post(
        json={
            "inputs": prompt,
            "parameters": {"max_new_tokens": 1000},
            "task": "text-generation",
        },
    )
    return json.loads(response.decode())[0]["generated_text"]

QA_generation_prompt = """
Your task is to write a factoid question and an answer given a context.
Your factoid question should be answerable with a specific, concise piece of factual information from the context.
Your factoid question should be formulated in the same style as questions users could ask in a search engine.
This means that your factoid question MUST NOT mention something like "according to the passage" or "context".

Provide your answer as follows:

Output:::
Factoid question: (your factoid question)
Answer: (your answer to the factoid question)

Now here is the context.

Context: {context}\n
Output:::"""

N_GENERATIONS = 200

print(f"Generating {N_GENERATIONS} QA couples...")

outputs = []
for sampled_context in tqdm(random.sample(docs_processed, N_GENERATIONS)):
    # Generate QA couple
    output_QA_couple = call_llm(llm_client, QA_generation_prompt.format(context=sampled_context.page_content))
    try:
        question = output_QA_couple.split("Factoid question: ")[-1].split("Answer: ")[0]
        answer = output_QA_couple.split("Answer: ")[-1]
        assert len(answer) < 300, "Answer is too long"
        outputs.append(
            {
                "question": question,
                "answer": answer
            }
        )
    except:
        continue

# Save the generated QA couples
output_file = "generated_qa.json"
with open(output_file, "w") as f:
    json.dump(outputs, f, indent=4, ensure_ascii=False)