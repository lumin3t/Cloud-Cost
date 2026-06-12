import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgotpassword";
import NavBar from "./components/NavBar";
import "./App.css";

function Home() {
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
    <div>
      <NavBar />

      <main className="dashboard-content">
        <h1>Cloud Guardian</h1>
        <h3>AI-Powered Cloud Cost Optimization Assistant</h3>

        <div className="analyse-form">
          <label>
            AI Prompt
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter prompt for the AI..."
              rows={4}
              style={{ width: "100%" }}
            />
          </label>

          <label style={{ display: "block", marginTop: 12 }}>
            Upload File
            <input type="file" onChange={handleFileChange} />
            {file && <div>Selected file: {file.name}</div>}
          </label>

          <button onClick={handleAnalyse} style={{ marginTop: 12 }}>
            Analyse
          </button>
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
