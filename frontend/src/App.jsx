import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgotpassword";
import NavBar from "./components/NavBar";

function Home() {
  //small change to track
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0] ?? null);
  };

  const handleAnalyse = async () => {
    const form = new FormData();
    form.append("prompt", prompt);
    if (file) form.append("file", file);

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      console.log("Analyse result:", data);
      alert("Analyse finished (check console).");
    } catch (err) {
      console.error(err);
      alert("Analyse failed.");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-purple-500/30">
      <NavBar />

      <main className="mx-auto max-w-4xl px-6 py-16 flex flex-col items-center relative overflow-hidden">
        
        {/* Decorative Background Rainbow Blur Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full opacity-15 dark:opacity-20 blur-[100px] pointer-events-none" />

        {/* Title Block - Extra Bold AI App Typography */}
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-text-title mb-4 leading-tight">
            Cloud{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-amber-400 bg-clip-text text-transparent animate-gradient-xy">
              Guardian
            </span>
          </h1>
          <p className="text-base md:text-lg text-text/80 font-medium max-w-xl mx-auto">
            Monitor your cloud costs!
          </p>
        </div>

        {/* Form Dashboard Module (Modern Floating Card Container) */}
        <div className="w-full bg-surface/80 backdrop-blur-md rounded-3xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 md:p-10 relative z-10">
          
          {/* AI Prompt Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-widest text-text-title/70 mb-2.5">
              Ask Cloud Guardian doubts
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Cloud Guardian to check for vulnerabilities, analyze IAM permissions, or optimize clusters..."
              rows={4}
              className="w-full p-4 rounded-2xl border border-border bg-surface text-text-title placeholder:text-text/40 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none shadow-xs"
            />
          </div>

          {/* Upload Section - Rainbow Gradient Hover Zone */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-widest text-text-title/70 mb-2.5">
              Billing data upload (CSV)
            </label>
            <div className="group relative w-full border border-dashed border-border rounded-2xl p-8 bg-bg/30 hover:bg-bg/10 flex flex-col items-center justify-center gap-3 transition-all duration-300">
              
              {/* Subtle hover gradient frame effect */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-purple-500/30 pointer-events-none transition-all" />

              <input 
                type="file" 
                onChange={handleFileChange} 
                className="w-full max-w-xs text-sm text-text text-center file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-gradient-to-r file:from-purple-600 file:to-indigo-600 file:text-white hover:file:opacity-90 cursor-pointer file:cursor-pointer"
              />
              {file ? (
                <div className="text-xs font-mono bg-code-bg px-4 py-2 rounded-xl border border-border text-text-title flex items-center gap-2 mt-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  {file.name}
                </div>
              ) : (
                <span className="text-xs text-text/40 mt-1">Upload `.json`, `.yaml`, or infrastructure sheets</span>
              )}
            </div>
          </div>

          {/* Primary Submit Button with Striking Premium Gradient */}
          <div className="flex justify-end">
            <button 
              onClick={handleAnalyse} 
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              Analyze
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}