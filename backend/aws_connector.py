import boto3
import pandas as pd
from datetime import datetime, timedelta


def load_aws_data(
    access_key,
    secret_key,
    region="us-east-1"
):

    session = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region
    )

    # ----------------------------
    # EC2
    # ----------------------------

    ec2 = session.client("ec2")

    usage_rows = []

    reservations = ec2.describe_instances()

    for reservation in reservations["Reservations"]:
        for instance in reservation["Instances"]:

            usage_rows.append({
                "resource_id": instance["InstanceId"],
                "service": "EC2",
                "cpu_usage": 50,
                "memory_usage": 50,
                "hours_running": 720,
                "monthly_cost": 100
            })

    usage_metrics = pd.DataFrame(usage_rows)

    # ----------------------------
    # COST EXPLORER
    # ----------------------------

    billing_rows = []

    try:

        ce = session.client(
            "ce",
            region_name="us-east-1"
        )

        end = datetime.utcnow().date()
        start = end - timedelta(days=30)

        response = ce.get_cost_and_usage(
            TimePeriod={
                "Start": str(start),
                "End": str(end)
            },
            Granularity="DAILY",
            Metrics=["UnblendedCost"],
            GroupBy=[
                {
                    "Type": "DIMENSION",
                    "Key": "SERVICE"
                }
            ]
        )

        for day in response["ResultsByTime"]:

            date = day["TimePeriod"]["Start"]

            for group in day["Groups"]:

                service = group["Keys"][0]

                cost = float(
                    group["Metrics"]
                    ["UnblendedCost"]
                    ["Amount"]
                )

                billing_rows.append({
                    "date": date,
                    "service": service,
                    "cost": cost
                })

    except Exception as e:
        print("Cost Explorer Error:", e)

    billing = pd.DataFrame(billing_rows)

    # ----------------------------
    # CLOUDWATCH
    # ----------------------------

    log_rows = []

    try:

        logs_client = session.client("logs")

        groups = logs_client.describe_log_groups()

        for group in groups["logGroups"][:5]:

            streams = logs_client.describe_log_streams(
                logGroupName=group["logGroupName"],
                orderBy="LastEventTime",
                descending=True
            )

            if not streams["logStreams"]:
                continue

            stream_name = streams["logStreams"][0][
                "logStreamName"
            ]

            events = logs_client.get_log_events(
                logGroupName=group["logGroupName"],
                logStreamName=stream_name,
                limit=50
            )

            for event in events["events"]:

                log_rows.append({
                    "timestamp":
                    datetime.fromtimestamp(
                        event["timestamp"] / 1000
                    ),

                    "service":
                    group["logGroupName"],

                    "status_code":
                    200,

                    "error_message":
                    event["message"][:200]
                })

    except Exception as e:
        print("CloudWatch Error:", e)

    logs = pd.DataFrame(log_rows)

    return {
        "billing": billing,
        "usage_metrics": usage_metrics,
        "logs": logs
    }