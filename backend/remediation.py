def generate_remediation(findings):
    recommendations = []

    for finding in findings:
        finding_type = finding["type"]

        if finding_type == "idle_vm":
            recommendations.append({
                "resource": finding["resource"],
                "priority": "high",
                "action": "Terminate or downsize instance",
                "reason": finding["detail"],
                "estimated_saving": finding["estimated_saving"]
            })

        elif finding_type == "oversized_db":
            recommendations.append({
                "resource": finding["resource"],
                "priority": "high",
                "action": "Right-size RDS instance",
                "reason": finding["detail"],
                "estimated_saving": finding["estimated_saving"]
            })

        elif finding_type == "billing_spike":
            recommendations.append({
                "resource": finding["resource"],
                "priority": "high",
                "action": "Investigate billing anomaly",
                "reason": finding["detail"],
                "estimated_saving": finding["estimated_saving"]
            })

        elif finding_type == "security_anomaly":
            recommendations.append({
                "resource": finding["resource"],
                "priority": "critical",
                "action": "Enable rate limiting, MFA and IP blocking",
                "reason": finding["detail"],
                "estimated_saving": 0
            })

        elif finding_type == "error_spike":
            recommendations.append({
                "resource": finding["resource"],
                "priority": "high",
                "action": "Investigate failures and add retry/circuit breaker logic",
                "reason": finding["detail"],
                "estimated_saving": 0
            })

        elif finding_type == "no_autoscaling":
            recommendations.append({
                "resource": finding["resource"],
                "priority": "medium",
                "action": "Configure autoscaling",
                "reason": finding["detail"],
                "estimated_saving": 0
            })

        elif finding_type == "compliance_flag":
            recommendations.append({
                "resource": finding["resource"],
                "priority": "medium",
                "action": "Apply shutdown schedules",
                "reason": finding["detail"],
                "estimated_saving": finding["estimated_saving"]
            })

    return recommendations