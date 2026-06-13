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

              <div>
                <div className="font-bold">
                  {item.resource}
                </div>

                <div className="text-sm opacity-70">
                  {item.detail}
                </div>
              </div>

              <div
                className="
                px-3
                py-1
                rounded-full
                bg-purple-500/20
              "
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