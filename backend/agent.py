import os
import requests
from dotenv import load_dotenv

from agent_tools import (
    set_files,
    get_billing_trends,
    get_error_patterns,
    get_resource_metrics,
    get_security_analysis,
    get_scalability_analysis,
    calculate_total_savings,
    find_most_wasteful_resource

)


load_dotenv()


def run_groq_fallback(question: str) -> str:

    context = f"""
Billing Trends:
{get_billing_trends()}

Error Patterns:
{get_error_patterns()}

Most Wasteful Resource:
{find_most_wasteful_resource()}

Resource Metrics:
{get_resource_metrics()}

Security Analysis:
{get_security_analysis()}

Scalability Analysis:
{get_scalability_analysis()}

Savings Analysis:
{calculate_total_savings()}
"""

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a cloud cost optimization expert. "
                        "Analyze the cloud data and answer using only the evidence provided. "
                        "Identify cost waste, root causes, security issues, "
                        "scalability risks and savings opportunities."
                    )
                },
                {
                    "role": "user",
                    "content": f"{context}\n\nQuestion: {question}"
                }
            ],
            "temperature": 0.2,
            "max_tokens": 500
        },
        timeout=30
    )

    response.raise_for_status()

    return response.json()["choices"][0]["message"]["content"]


def run_agent(stored_files: dict, question: str) -> str:

    set_files(stored_files)

    print("Incoming files:", stored_files.keys())

    try:
        return run_groq_fallback(question)

    except Exception as e:
        return f"Agent Error: {str(e)}"