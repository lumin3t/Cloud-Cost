import { useState } from "react";

export default function Upload() {
  const [billingFile, setBillingFile] = useState(null);
  const [usageFile, setUsageFile] = useState(null);
  const [logsFile, setLogsFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleUpload = async () => {
    if (!billingFile || !usageFile || !logsFile) {
      alert("Please upload all three files: billing, usage metrics, and logs.");
      return;
    }

    const formData = new FormData();
    formData.append("billing", billingFile);
    formData.append("usage_metrics", usageFile);
    formData.append("logs", logsFile);

    setStatusMessage("Uploading files...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatusMessage("✓ Upload successful!");
        alert("Your files have been uploaded successfully.");
        setBillingFile(null);
        setUsageFile(null);
        setLogsFile(null);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("✗ Upload failed. Please try again.");
      alert("Something went wrong. Please check your files and try again.");
    }
  };

  const FileInput = ({ label, file, setFile }) => (
    <div className="border border-border rounded-lg p-4 bg-bg/10 flex flex-col gap-2 text-center hover:bg-bg/20 transition-colors">
      <span className="text-sm font-semibold text-text-title">{label}</span>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0] ?? null)}
        className="w-full text-xs text-text file:mr-2 file:py-2 file:px-4 file:rounded-md file:border file:border-border file:bg-surface/60 file:text-text file:hover:bg-surface file:cursor-pointer file:transition-colors"
      />
      {file && <span className="text-xs text-purple-600 truncate">{file.name}</span>}
    </div>
  );

  return (
    <div className="w-full bg-surface/20 backdrop-blur-sm rounded-xl border border-border/50 p-6 text-left">
      <h3 className="text-sm font-bold text-text-title mb-4">Upload Your Files</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FileInput label="Billing" file={billingFile} setFile={setBillingFile} />
        <FileInput label="Usage Metrics" file={usageFile} setFile={setUsageFile} />
        <FileInput label="Logs" file={logsFile} setFile={setLogsFile} />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/30">
        {statusMessage && (
          <span className="text-sm text-purple-600 dark:text-purple-400">{statusMessage}</span>
        )}
       <div className="flex items-center justify-end">
        <button
            onClick={handleUpload}
        className="w-full sm:w-auto px-8 py-2.5 bg-text-title text-bg font-semibold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
         >
        Upload
    </button>
</div>
      </div>
    </div>
  );
}
