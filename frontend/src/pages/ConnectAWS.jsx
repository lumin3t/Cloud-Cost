import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function ConnectAWS() {
  const navigate = useNavigate();

  // Form State
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState("us-east-1");

  // UX State
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [statusLogs, setStatusLogs] = useState([]);
  const [error, setError] = useState(null);
  
  // Store the data received from the backend to download later
  const [extractedData, setExtractedData] = useState(null);

  const addLog = (message, delay) => {
    setTimeout(() => {
      setStatusLogs((prev) => [...prev, message]);
    }, delay);
  };

  const connectAWS = async () => {
    if (!accessKey || !secretKey || !region) {
      setError("Please fill in all AWS credentials.");
      return;
    }

    setError(null);
    setIsConnecting(true);
    setStatusLogs(["Initiating secure AWS Boto3 session..."]);

    addLog("Extracting EC2 instance reservations...", 800);
    addLog("Querying Cost Explorer for 30-day unblended costs...", 1500);
    addLog("Fetching CloudWatch log streams...", 2200);

    try {
      const res = await fetch("/api/connect-aws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          secret_key: secretKey,
          region: region,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Save the data to state so we can download it later
        setExtractedData(data.datasets); 
        
        setTimeout(() => {
          setIsConnecting(false);
          setIsConnected(true);
        }, 3000);
      } else {
        throw new Error(data.message || "Connection rejected by AWS.");
      }
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      setError(err.message || "Failed to establish AWS connection.");
      setStatusLogs([]);
    }
  };

  // Function to handle the actual CSV downloading
  const downloadCSV = (filename, csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    if (!extractedData) {
      alert("No data available to download. Did the backend send the datasets?");
      return;
    }
    // Trigger 3 sequential downloads
    if (extractedData.billing) downloadCSV("billing.csv", extractedData.billing);
    if (extractedData.usage_metrics) downloadCSV("usage_metrics.csv", extractedData.usage_metrics);
    if (extractedData.logs) downloadCSV("logs.csv", extractedData.logs);
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-purple-500/30">
      <NavBar />

      <main className="mx-auto max-w-3xl px-6 py-16 flex flex-col items-center relative overflow-hidden">
        
        {/* Purple Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full opacity-15 blur-[100px] pointer-events-none" />

        <div className="w-full bg-surface/80 backdrop-blur-md rounded-3xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 relative z-10 transition-all duration-500">
          
          {!isConnected ? (
            <>
              {/* Form View */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
                  Environment Setup
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-text-title">
                  Connect <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">AWS</span>
                </h1>
                <p className="mt-3 text-sm text-text/70">
                  Securely mount your infrastructure to begin perimeter and cost analysis.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium text-center">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-text-title/70 mb-1.5">Access Key ID</label>
                  <input
                    type="text"
                    disabled={isConnecting}
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="AKIAIOSFODNN7EXAMPLE"
                    className="w-full p-4 rounded-xl border border-border bg-bg/50 text-text-title placeholder:text-text/30 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-text-title/70 mb-1.5">Secret Access Key</label>
                  <input
                    type="password"
                    disabled={isConnecting}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="••••••••••••••••••••••••••••••••••••••••"
                    className="w-full p-4 rounded-xl border border-border bg-bg/50 text-text-title placeholder:text-text/30 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-text-title/70 mb-1.5">Default Region</label>
                  <input
                    type="text"
                    disabled={isConnecting}
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full p-4 rounded-xl border border-border bg-bg/50 text-text-title focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm font-mono"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={connectAWS}
                    disabled={isConnecting}
                    className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white transition-all shadow-md active:scale-[0.98] ${
                      isConnecting 
                        ? "bg-purple-500/50 cursor-not-allowed animate-pulse" 
                        : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 shadow-purple-500/20 cursor-pointer"
                    }`}
                  >
                    {isConnecting ? "Establishing Connection..." : "Initialize AWS Environment"}
                  </button>

                  {isConnecting && (
                    <div className="mt-6 p-4 rounded-xl bg-code-bg border border-border/50 text-left font-mono text-[10px] text-text/80 h-32 overflow-hidden flex flex-col justify-end">
                      {statusLogs.map((log, i) => (
                        <div key={i} className="animate-fadeIn opacity-80 flex gap-2">
                          <span className="text-purple-500">{">"}</span> {log}
                        </div>
                      ))}
                      <div className="animate-pulse opacity-50 flex gap-2 mt-1">
                        <span className="text-purple-500">{">"}</span> _
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            
            /* Success Dashboard View */
            <div className="text-center py-8 animate-fadeIn">
              <div className="w-20 h-20 mx-auto bg-green-500/10 border-2 border-green-500/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-extrabold tracking-tight text-text-title mb-2">
                Pipeline Active
              </h2>
              <p className="text-sm text-text/70 mb-8 max-w-md mx-auto">
                AWS infrastructure mapped successfully. 3 datasets (Billing, EC2 Usage, Logs) have been extracted and are ready for analysis or export.
              </p>

              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button
                  onClick={handleDownloadAll}
                  className="w-full px-6 py-3.5 rounded-xl bg-bg border-2 border-purple-500 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider hover:bg-purple-500/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download CSV Files
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full px-6 py-3.5 rounded-xl bg-text-title text-bg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}