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

    # --- IDLE VM DETECTION ---
    idle_vms = usage[(usage["cpu_usage"] < 10) & (usage["hours_running"] >= 700)]
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

    return findings