import { useEffect, useState } from "react";

export default function Remediate() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRemediation();
  }, []);

  const fetchRemediation = async () => {
    try {
      const res = await fetch("/api/remediate", {
        method: "POST",
      });

      const json = await res.json();
      setData(json || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        Generating Fixes...
      </div>
    );
  }

  if (!data) {
    return <div>No remediation data available.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-xl">
        AI Remediation Plan
      </h2>

      {/* Recommendations */}
      {(data.recommendations || []).map((item, index) => (
        <div
          key={index}
          className="
            rounded-2xl
            border
            border-border
            p-5
            bg-bg/20
          "
        >
          <div className="flex justify-between gap-4">

            {/* Left */}
            <div>
              <div className="font-bold">
                {item.resource}
              </div>

              <div className="text-sm opacity-70 mt-1">
                {item.action}
              </div>

              <div className="text-xs opacity-60 mt-1">
                {item.reason}
              </div>

              {item.estimated_saving > 0 && (
                <div className="text-xs text-green-500 mt-2">
                  Saved: ${item.estimated_saving}
                </div>
              )}
            </div>

            {/* Right (priority like Detect severity) */}
            <div
              className={`
                px-3
                py-1
                text-sm
                font-semibold
                ${getPriorityColor(item.priority)}
              `}
            >
              {item.priority}
            </div>

          </div>
        </div>
      ))}

      {/* Executive Summary */}
      {data.executive_summary && (
        <div className="   
            rounded-3xl
            p-6
            bg-gradient-to-r
            from-purple-600/10
            to-cyan-600/10
            border
            border-border
            backdrop-blur-md">
          <div className="
            mb-4
            text-xs
            uppercase
            tracking-widest
            text-purple-400
            font-bold">
            AI Generated Summary
          </div>

          <div className="text-sm whitespace-pre-line opacity-80">
            {data.executive_summary}
          </div>
        </div>
      )}
    </div>
  );
}