from smolagents import tool
import pandas as pd

# Global reference to stored files
_stored_files = {}

def set_files(files):
    global _stored_files
    _stored_files = files

@tool
def get_billing_trends() -> str:
    """Returns billing trends and detects cost spikes across services."""
    billing = _stored_files["billing"]
    billing["date"] = pd.to_datetime(billing["date"])
    billing_by_service = billing.groupby("service")
    
    result = []
    for service, group in billing_by_service:
        group = group.sort_values("date")
        max_cost = float(group["cost"].max())
        min_cost = float(group["cost"].min())
        avg_cost = float(group["cost"].mean())
        result.append(f"{service}: min=${min_cost}, max=${max_cost}, avg=${avg_cost:.1f}")
    
    return "Billing trends:\n" + "\n".join(result)

@tool
def get_error_patterns() -> str:
    """Returns error patterns and spikes from logs."""
    logs = _stored_files["logs"]
    logs["timestamp"] = pd.to_datetime(logs["timestamp"])
    
    error_logs = logs[logs["status_code"] == 500]
    
    if error_logs.empty:
        return "No errors found in logs."
    
    by_service = error_logs.groupby("service").size().reset_index(name="count")
    by_date = error_logs.groupby(error_logs["timestamp"].dt.date).size().reset_index(name="count")
    
    service_summary = "\n".join([f"{r['service']}: {int(r['count'])} errors" for _, r in by_service.iterrows()])
    date_summary = "\n".join([f"{r['timestamp']}: {int(r['count'])} errors" for _, r in by_date.iterrows()])
    
    return f"Errors by service:\n{service_summary}\n\nErrors by date:\n{date_summary}"

@tool
def get_resource_metrics() -> str:
    """Returns CPU, memory and usage metrics for all cloud resources."""
    usage = _stored_files["usage_metrics"]
    
    result = []
    for _, row in usage.iterrows():
        result.append(
            f"{row['resource_id']} ({row['service']}): "
            f"CPU={int(row['cpu_usage'])}%, "
            f"Memory={int(row['memory_usage'])}%, "
            f"Hours={int(row['hours_running'])}, "
            f"Cost=${float(row['monthly_cost'])}/month"
        )
    
    return "Resource metrics:\n" + "\n".join(result)

@tool
def calculate_total_savings() -> str:
    """Calculates total estimated savings from idle and oversized resources."""
    usage = _stored_files["usage_metrics"]
    
    idle = usage[(usage["cpu_usage"] < 10) & (usage["hours_running"] >= 700)]
    oversized_db = usage[(usage["service"] == "RDS") & (usage["cpu_usage"] < 15)]
    
    idle_savings = float((idle["monthly_cost"] * 0.8).sum())
    db_savings = float((oversized_db["monthly_cost"] * 0.4).sum())
    total = idle_savings + db_savings
    
    return f"Estimated savings: idle VMs=${idle_savings:.2f}/month, oversized DBs=${db_savings:.2f}/month, total=${total:.2f}/month"