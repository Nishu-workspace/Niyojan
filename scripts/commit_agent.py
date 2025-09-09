import subprocess
import shlex
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool
from langgraph.prebuilt import chat_agent_executor

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("Error: GOOGLE_API_KEY not found. Make sure it's in your .env file.")

@tool(description="Get staged git changes (diff).")
def git_diff() -> str:
  """Executes `git diff --staged` and returns the output."""
  try:
    return subprocess.check_output(shlex.split("git diff --staged")).decode("utf-8", "ignore")
  except subprocess.CalledProcessError:
    return ""

@tool(description="Ask user if intent is unclear.")
def ask_user(prompt: str) -> str:
  """Prompts the user for input if the changes are ambiguous."""
  return input((prompt or "The intent of the changes is unclear. Could you provide a brief summary?").strip() + " ")

model = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", temperature=0, google_api_key=api_key)

agent = chat_agent_executor.create_tool_calling_executor(model, [git_diff, ask_user])

result = agent.invoke({
    "messages": [
        ("system",
         "You are an expert at writing concise and insightful git commit messages following the Conventional Commits specification. "
         "Your goal is to capture the 'what' and 'why' of the changes in a single line. "
         "1. First, use the `git_diff` tool to analyze the staged code. If there are no changes, stop. "
         "2. From the diff, determine the primary intent: is it a new feature (feat), a bug fix (fix), a refactor, a documentation update (docs), etc.? "
         "3. If the intent is unclear, use the `ask_user` tool once to get a brief summary. "
         "4. Write a single-line commit message in the format 'type: subject'. The subject must be in the imperative mood (e.g., 'add feature' not 'added feature'). "
         "5. Your final response must be ONLY the single-line commit message and nothing else."),
        ("user", "Write the commit message for my staged changes.")
    ]
})

if result.get("messages") and len(result["messages"]) > 1:
    print(result["messages"][-1].content.strip())
else:
    print("Could not generate a commit message. Please check for staged changes.")