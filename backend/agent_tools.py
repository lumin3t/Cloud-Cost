from smolagents import tool
import pandas as pd

_stored_files = {}


def set_files(files):
    """
    Update the existing dictionary instead of replacing it.
    This prevents stale references in other modules.
    """
    _stored_files.clear()
    _stored_files.update(files)

@tool
def find_most_wasteful_resource() -> str:
    """Finds the resource with the highest wasted spend."""

    usage = _stored_files["usage_metrics"]

    usage = usage.copy()

    usage["waste_score"] = (
        usage["monthly_cost"] * (100 - usage["cpu_usage"]) / 100
    )

    worst = usage.loc[usage["waste_score"].idxmax()]

    return (
        f"Most wasteful resource: {worst['resource_id']} "
        f"({worst['service']})\n"
        f"CPU Usage: {worst['cpu_usage']}%\n"
        f"Monthly Cost: ${worst['monthly_cost']}\n"
        f"Estimated Waste Score: ${worst['waste_score']:.2f}"
    )

@tool
def get_billing_trends() -> str:
    """Returns billing trends and detects cost spikes across services."""

    if "billing" not in _stored_files:
        return "Billing data not uploaded."

    billing = _stored_files["billing"].copy()
    billing["date"] = pd.to_datetime(billing["date"])

    result = []

    for service, group in billing.groupby("service"):
        group = group.sort_values("date")

        result.append(
            f"{service}: "
            f"min=${group['cost'].min():.2f}, "
            f"max=${group['cost'].max():.2f}, "
            f"avg=${group['cost'].mean():.2f}"
        )

    return "Billing trends:\n" + "\n".join(result)


@tool
def get_error_patterns() -> str:
    """Returns error patterns and spikes from logs."""

    if "logs" not in _stored_files:
        return "Log data not uploaded."

    logs = _stored_files["logs"].copy()
    logs["timestamp"] = pd.to_datetime(logs["timestamp"])

    error_logs = logs[logs["status_code"] == 500]

    if error_logs.empty:
        return "No errors found."

    by_service = error_logs.groupby("service").size()
    by_date = error_logs.groupby(error_logs["timestamp"].dt.date).size()

    service_summary = "\n".join(
        [f"{service}: {count} errors" for service, count in by_service.items()]
    )

    date_summary = "\n".join(
        [f"{date}: {count} errors" for date, count in by_date.items()]
    )

    return f"Errors by service:\n{service_summary}\n\nErrors by date:\n{date_summary}"


@tool
def get_resource_metrics() -> str:
    """Returns CPU, memory and usage metrics for all cloud resources."""

    if "usage_metrics" not in _stored_files:
        return "Usage metrics not uploaded."

    usage = _stored_files["usage_metrics"]

    result = []

    for _, row in usage.iterrows():
        result.append(
            f"{row['resource_id']} ({row['service']}): "
            f"CPU={int(row['cpu_usage'])}%, "
            f"Memory={int(row['memory_usage'])}%, "
            f"Hours={int(row['hours_running'])}, "
            f"Cost=${float(row['monthly_cost']):.2f}/month"
        )

    return "Resource metrics:\n" + "\n".join(result)


@tool
def calculate_total_savings() -> str:
    """Calculates total estimated savings."""

    if "usage_metrics" not in _stored_files:
        return "Usage metrics not uploaded."

    usage = _stored_files["usage_metrics"]

    idle = usage[
        (usage["cpu_usage"] < 10)
        & (usage["hours_running"] >= 700)
    ]

    oversized_db = usage[
        (usage["service"] == "RDS")
        & (usage["cpu_usage"] < 15)
    ]

    idle_savings = float((idle["monthly_cost"] * 0.8).sum())
    db_savings = float((oversized_db["monthly_cost"] * 0.4).sum())

    total = idle_savings + db_savings

    return (
        f"Idle Savings: ${idle_savings:.2f}/month\n"
        f"DB Savings: ${db_savings:.2f}/month\n"
        f"Total Savings: ${total:.2f}/month"
    )


@tool
def get_security_analysis() -> str:
    """Analyzes logs for security threats."""

    if "logs" not in _stored_files:
        return "Log data not uploaded."

    logs = _stored_files["logs"].copy()
    logs["timestamp"] = pd.to_datetime(logs["timestamp"])

    findings = []

    auth_errors = logs[
        (logs["service"] == "auth-api")
        & (logs["status_code"] == 500)
    ]

    if len(auth_errors) > 5:
        findings.append(
            f"Potential brute-force activity: "
            f"{len(auth_errors)} auth-api failures detected"
        )

    odd_hours = logs[
        (logs["status_code"] == 500)
        & (logs["timestamp"].dt.hour.between(0, 5))
    ]

    if len(odd_hours) > 3:
        findings.append(
            f"{len(odd_hours)} server errors occurred between midnight and 5 AM"
        )

    return "\n".join(findings) if findings else "No security threats detected"


@tool
def get_scalability_analysis() -> str:
    """Analyzes scalability risks."""

    if "usage_metrics" not in _stored_files:
        return "Usage metrics not uploaded."

    usage = _stored_files["usage_metrics"]

    findings = []

    high_cpu = usage[
        (usage["cpu_usage"] > 80)
        & (usage["hours_running"] >= 700)
    ]

    for _, row in high_cpu.iterrows():
        findings.append(
            f"{row['resource_id']} running at "
            f"{row['cpu_usage']}% CPU all month. Autoscaling recommended."
        )

    high_memory = usage[usage["memory_usage"] > 85]

    for _, row in high_memory.iterrows():
        findings.append(
            f"{row['resource_id']} memory usage at "
            f"{row['memory_usage']}%. Risk of OOM."
        )

    return "\n".join(findings) if findings else "No scalability issues detected"