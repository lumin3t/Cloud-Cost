import { useEffect, useState } from "react";

export default function Remediate() {
  const [plan, setPlan] = useState("");
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

      setPlan(json.remediation_plan || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        Generating Fixes...
      </div>
    );
  }

  return (
    <div
      className="
      rounded-3xl
      p-6
      bg-gradient-to-r
      from-purple-600/10
      to-cyan-600/10
      border
      border-border
      backdrop-blur-md
    "
    >
      <div
        className="
        mb-4
        text-xs
        uppercase
        tracking-widest
        text-purple-400
        font-bold
      "
      >
        AI Remediation Plan
      </div>

      <div
        className="
        text-sm
        leading-8
        text-text-title/90
        whitespace-pre-line
      "
      >
        {plan}
      </div>
    </div>
  );
}