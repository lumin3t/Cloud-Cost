import { useEffect, useState } from "react";

export default function Detect() {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetect();
  }, []);

  const fetchDetect = async () => {
    try {
      const res = await fetch("/api/detect", {
        method: "POST",
      });

      const json = await res.json();

      setFindings(json.findings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch ((severity || "").toLowerCase()) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        Detecting Issues...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-xl">
        Detected Issues
      </h2>

      {findings.length === 0 ? (
        <div>No issues found.</div>
      ) : (
        findings.map((item, index) => (
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
            <div className="flex justify-between">

              {/* Left content */}
              <div>
                <div className="font-bold">
                  {item.resource}
                </div>

                <div className="text-sm opacity-70">
                  {item.detail}
                </div>
              </div>

              {/* Severity (now color-coded properly) */}
              <div
                className={`
                  px-3
                  py-1
                  text-sm
                  font-semibold
                  ${getSeverityColor(item.severity)}
                `}
              >
                {item.severity}
              </div>

            </div>
          </div>
        ))
      )}
    </div>
  );
}