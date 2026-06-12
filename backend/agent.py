import os
from dotenv import load_dotenv
from smolagents import ToolCallingAgent, LiteLLMModel
from agent_tools import (
    get_billing_trends,
    get_error_patterns,
    get_resource_metrics,
    calculate_total_savings,
    set_files
)

load_dotenv()

def run_agent(stored_files: dict, question: str) -> str:
    set_files(stored_files)
    
    try:
        model = LiteLLMModel(
    model_id="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)
        
        agent = ToolCallingAgent(
            tools=[
                get_billing_trends,
                get_error_patterns,
                get_resource_metrics,
                calculate_total_savings
            ],
            model=model,
            max_steps=5
        )

        full_question = f"""
You are a cloud cost expert. Follow these steps:
1. Call get_billing_trends() to find cost spikes
2. Call get_error_patterns() to find errors on spike dates
3. Call get_resource_metrics() to check resource health
4. Call calculate_total_savings() for savings estimate
5. Connect all findings into a root cause explanation

Question: {question}
"""
        
        result = agent.run(full_question)
        return str(result)
    
    except Exception as e:
        return f"Agent error: {str(e)}"