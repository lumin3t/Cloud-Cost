import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import NavBar from "./components/NavBar";

import Upload from "./components/Upload";
import Ask from "./components/Ask";
import Analyze from "./components/Analyze";
import Detect from "./components/Detect";
import Remediate from "./components/Remediate";
import Health from "./components/Health";
import ConnectAWS from "./pages/ConnectAWS";

function Home() {
  const [prompt, setPrompt] = useState("");

  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [askResult, setAskResult] = useState("");

  const [openSections, setOpenSections] = useState({
    analyze: true,
    detect: true,
    remediate: true,
  });

  const toggleSection = (name) => {
    setOpenSections((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleAnalyse = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: prompt,
        }),
      });

      const data = await res.json();

      setAskResult(data.answer || "No response");

      setHasAnalyzed(true);

    } catch (err) {
      console.error(err);

      setAskResult("Failed to generate summary.");
      setHasAnalyzed(true);

    } finally {
      setLoading(false);
    }
  };

  const ResultCard = ({
    title,
    open,
    onToggle,
    children,
  }) => (
    <div className="bg-surface/80 backdrop-blur-xl rounded-3xl border border-border overflow-hidden shadow-lg">

      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex justify-between items-center hover:bg-white/3 transition cursor-pointer"
      >
        <h3 className="text-lg font-bold text-text-title">
          {title}
        </h3>

        <span
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="border-t border-border p-6">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-text">

      <NavBar />

      <main className="max-w-7xl mx-auto px-6 py-14">

        {/* Hero */}

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

        {/* Input */}

        <section className="rounded-[32px] border border-border bg-surface/70 backdrop-blur-xl p-8 shadow-xl mb-10">

          <label className="text-xs uppercase tracking-widest text-text/50 font-bold">
            Ask AI
          </label>

          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Why did my cloud bill increase?"
            className="
              mt-3
              w-full
              rounded-2xl
              border
              border-border
              bg-bg/20
              p-5
              resize-none
              outline-none
            "
          />

          <div className="mt-6">
            <Upload />
          </div>

          <div className="flex justify-center mt-8">

            <button
              onClick={handleAnalyse}
              disabled={loading}
              className="
                px-10
                py-3
                rounded-2xl
                bg-text-title
                text-bg
                font-bold
                hover:scale-[1.02]
                active:scale-[0.98]
                transition
                cursor-pointer
              "
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>

          </div>

        </section>

        <div className="mb-10">
          <Health />
        </div>

        {hasAnalyzed && (
          <>

            {/* Ask Hero */}

            {/* AI SUMMARY */}
<section className="mb-8">
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
      AI Generated Summary
    </div>
    <Ask result={askResult} />
  </div>
</section>

            {/* Result Grid */}

            <div className="grid md:grid-cols-2 gap-6">

              <ResultCard
                title="Issue Detection"
                open={openSections.detect}
                onToggle={() =>
                  toggleSection("detect")
                }
              >
                <Detect />
              </ResultCard>
              <ResultCard
                  title="Remediation Plan"
                  open={openSections.remediate}
                  onToggle={() =>
                    toggleSection("remediate")
                  }
                >
                  <Remediate />
                </ResultCard>
              <div className="md:col-span-2">


                              <ResultCard
                title="Detailed Analysis"
                open={openSections.analyze}
                onToggle={() =>
                  toggleSection("analyze")
                }
              >
                <Analyze />
              </ResultCard>

              </div>

            </div>

          </>
        )}

      </main>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/*"
          element={<Home />}
        />

        <Route
          path="/connect-aws"
          element={<ConnectAWS />}
        />

      </Routes>

    </BrowserRouter>
  );
}