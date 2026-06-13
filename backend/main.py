import json

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from remediation import generate_remediation
from upload import router as upload_router, stored_files
from detection import run_detection, calculate_health_score
from agent import run_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)

class AskRequest(BaseModel):
    question: str

@app.get("/")
def root():
    return {"message": "CloudLens AI backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/detect")
def detect():
    if not stored_files:
        return {"error": "No files uploaded yet"}
    findings = run_detection(stored_files)
    return {"findings": findings}

@app.post("/ask")
def ask(payload: AskRequest):
    if not stored_files:
        return {"error": "No files uploaded yet"}
    answer = run_agent(stored_files, payload.question)
    return {"answer": answer}

@app.post("/remediate")
def remediate():
    if not stored_files:
        return {"error": "No files uploaded yet"}

    findings = run_detection(stored_files)


    recommendations = generate_remediation(findings)
    critical = sum(1 for r in recommendations if r["priority"] == "critical")
    high = sum(1 for r in recommendations if r["priority"] == "high")
    medium = sum(1 for r in recommendations if r["priority"] == "medium")

    total_savings = sum(
        r.get("estimated_saving", 0)
        for r in recommendations
    )

    recommendation_score = {
        "critical": critical,
        "high": high,
        "medium": medium,
        "total_monthly_savings": round(total_savings, 2)
    }

    findings_json = json.dumps(findings, indent=2)

    ai_summary = run_agent(
        stored_files,
        f"""
        Findings:

        {findings_json}
        Total projected savings: ${total_savings}

        Summarize ONLY these findings.
        Do not introduce information not present in the findings.
        Prioritize by severity and estimated savings.
        Use the provided total savings value.
        Do not invent new metrics.
        Keep under 150 words.
        Provide:
        1. Top 3 issues
        2. Expected monthly savings
        3. Recommended execution order
        Keep under 150 words.
        """
    )

    return {
        "recommendation_score": recommendation_score,
        "recommendations": recommendations,
        "executive_summary": ai_summary
    }

@app.post("/analyze")
def analyze():
    if not stored_files:
        return {"error": "No files uploaded yet"}

    # Step 1 - run detection
    findings = run_detection(stored_files)

    # Step 2 - summary numbers
    billing = stored_files["billing"]
    logs = stored_files["logs"]

    total_spend = float(billing["cost"].sum())
    total_saving = sum(f["estimated_saving"] for f in findings)
    total_errors = int(logs[logs["status_code"] == 500].shape[0])

    billing_by_service = billing.groupby("service")["cost"].max()
    biggest_spike_service = billing_by_service.idxmax()
    biggest_spike_value = float(billing_by_service.max())

    # Step 3 - graph data
    spend_by_service = (
        billing.groupby("service")["cost"]
        .sum()
        .reset_index()
        .rename(columns={"cost": "total_cost"})
    )
    spend_by_service["total_cost"] = spend_by_service["total_cost"].apply(float)

    logs["timestamp"] = pd.to_datetime(logs["timestamp"])
    errors_over_time = (
        logs[logs["status_code"] == 500]
        .groupby(logs["timestamp"].dt.date)
        .size()
        .reset_index(name="error_count")
    )
    errors_over_time["timestamp"] = errors_over_time["timestamp"].astype(str)
    errors_over_time["error_count"] = errors_over_time["error_count"].apply(int)

    # Step 4 - health score
    health_score = calculate_health_score(stored_files, findings)

    # Step 5 - cost savings
    projected_monthly = total_spend - total_saving
    cost_savings = {
        "current_monthly_spend": round(total_spend, 2),
        "projected_after_fix": round(projected_monthly, 2),
        "potential_savings": round(total_saving, 2),
        "savings_percentage": round((total_saving / total_spend) * 100, 1) if total_spend > 0 else 0
    }

    # Step 6 - agent summary
    agent_summary = run_agent(
        stored_files,
        "Summarize the top 3 cloud issues and give one recommended action for each. Be concise."
    )

    return {
        "summary": {
            "total_spend": round(total_spend, 2),
            "biggest_spike": f"{biggest_spike_service} ${biggest_spike_value}",
            "total_errors": total_errors,
            "estimated_savings": round(total_saving, 2)
        },
        "graphs": {
            "spend_by_service": spend_by_service.to_dict(orient="records"),
            "errors_over_time": errors_over_time.to_dict(orient="records")
        },
        "findings": findings,
        "health_score": health_score,
        "cost_savings": cost_savings,
        "agent_summary": agent_summary
    }