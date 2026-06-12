import pandas as pd

def run_detection(stored_files):
    findings = []
    billing = stored_files["billing"]
    usage = stored_files["usage_metrics"]
    logs = stored_files["logs"]

    # --- BILLING SPIKE DETECTION ---
    billing["date"] = pd.to_datetime(billing["date"])
    billing_by_service = billing.groupby("service")

    for service, group in billing_by_service:
        group = group.sort_values("date")
        max_cost = group["cost"].max()
        min_cost = group["cost"].min()
        if max_cost > min_cost * 2:
            findings.append({
                "type": "billing_spike",
                "severity": "high",
                "resource": service,
                "detail": f"{service} cost jumped from {float(min_cost)} to {float(max_cost)}",
                "estimated_saving": float(round(max_cost - min_cost, 2))
            })

    # --- IDLE VM DETECTION (exclude RDS) ---
    idle_vms = usage[
        (usage["cpu_usage"] < 10) &
        (usage["hours_running"] >= 700) &
        (usage["service"] != "RDS")
    ]
    for _, row in idle_vms.iterrows():
        findings.append({
            "type": "idle_vm",
            "severity": "high",
            "resource": str(row["resource_id"]),
            "detail": f"{row['resource_id']} ran {int(row['hours_running'])} hours at only {int(row['cpu_usage'])}% CPU",
            "estimated_saving": float(round(row["monthly_cost"] * 0.8, 2))
        })

    # --- OVERSIZED DATABASE DETECTION ---
    oversized_dbs = usage[(usage["service"] == "RDS") & (usage["cpu_usage"] < 15)]
    for _, row in oversized_dbs.iterrows():
        findings.append({
            "type": "oversized_db",
            "severity": "medium",
            "resource": str(row["resource_id"]),
            "detail": f"{row['resource_id']} is an RDS instance running at only {int(row['cpu_usage'])}% CPU",
            "estimated_saving": float(round(row["monthly_cost"] * 0.4, 2))
        })

    # --- ERROR SPIKE DETECTION ---
    logs["timestamp"] = pd.to_datetime(logs["timestamp"])
    error_logs = logs[logs["status_code"] == 500]
    error_by_service = error_logs.groupby("service").size().reset_index(name="error_count")

    for _, row in error_by_service.iterrows():
        if row["error_count"] >= 5:
            findings.append({
                "type": "error_spike",
                "severity": "high",
                "resource": str(row["service"]),
                "detail": f"{row['service']} had {int(row['error_count'])} errors",
                "estimated_saving": 0
            })

    # --- SECURITY ANOMALY DETECTION ---
    auth_errors = error_logs[error_logs["service"] == "auth-api"]
    if len(auth_errors) > 5:
        findings.append({
            "type": "security_anomaly",
            "severity": "high",
            "resource": "auth-api",
            "detail": f"auth-api had {int(len(auth_errors))} failures — possible brute force or misconfiguration",
            "estimated_saving": 0
        })

    # --- NO AUTOSCALING DETECTION ---
    high_cpu = usage[(usage["cpu_usage"] > 80) & (usage["hours_running"] >= 700)]
    for _, row in high_cpu.iterrows():
        findings.append({
            "type": "no_autoscaling",
            "severity": "medium",
            "resource": str(row["resource_id"]),
            "detail": f"{row['resource_id']} is running at {int(row['cpu_usage'])}% CPU constantly — autoscaling recommended",
            "estimated_saving": 0
        })

    # --- COMPLIANCE FLAG (exclude RDS) ---
    always_on = usage[
        (usage["hours_running"] >= 720) &
        (usage["service"] != "RDS") &
        (usage["cpu_usage"] < 10)
    ]
    for _, row in always_on.iterrows():
        findings.append({
            "type": "compliance_flag",
            "severity": "medium",
            "resource": str(row["resource_id"]),
            "detail": f"{row['resource_id']} has no shutdown policy — running 24/7 with low usage violates cost governance",
            "estimated_saving": float(round(row["monthly_cost"] * 0.3, 2))
        })

    return findings


def calculate_health_score(stored_files, findings):
    usage = stored_files["usage_metrics"]
    logs = stored_files["logs"]
    billing = stored_files["billing"]

    # Cost efficiency — penalize idle resources
    idle_count = len(usage[usage["cpu_usage"] < 10])
    total_resources = len(usage)
    cost_efficiency = max(0, 100 - (idle_count / total_resources * 100))

    # Reliability — penalize errors
    error_count = len(logs[logs["status_code"] == 500])
    reliability = max(0, 100 - (error_count * 5))

    # Resource utilization — 60% CPU is ideal
    avg_cpu = float(usage["cpu_usage"].mean())
    utilization = max(0, 100 - abs(avg_cpu - 60))

    # Logging efficiency — penalize CloudWatch spike
    billing_by_service = billing.groupby("service")["cost"].max()
    cloudwatch_cost = float(billing_by_service.get("CloudWatch", 0))
    logging_efficiency = max(0, 100 - (cloudwatch_cost / 2))

    overall = round(
        (cost_efficiency * 0.3) +
        (reliability * 0.3) +
        (utilization * 0.2) +
        (logging_efficiency * 0.2),
        1
    )

    return {
        "overall": overall,
        "cost_efficiency": round(cost_efficiency, 1),
        "reliability": round(reliability, 1),
        "resource_utilization": round(utilization, 1),
        "logging_efficiency": round(logging_efficiency, 1)
    }