import { useEffect, useState } from "react";

export default function Health() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/health");

      const json = await res.json();

      setStatus(json.status);
    } catch (err) {
      console.error(err);
      setStatus("offline");
    }
  };

  return (
    <div
      className="
      rounded-3xl
      p-6
      border
      border-border
      bg-surface/70
      backdrop-blur-xl
    "
    >
      <h3 className="font-bold mb-4">
        Health
      </h3>

      <div className="flex items-center gap-3">

        <div
          className={`w-3 h-3 rounded-full ${
            status === "ok"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />

        <span className="font-medium">
          {status}
        </span>

      </div>
    </div>
  );
}