import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="w-full bg-surface/60 backdrop-blur-md border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      
      {/* Brand Identity */}
      <Link to="/" className="text-xl font-black text-text-title tracking-tight flex items-center gap-1.5 group">
        <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 group-hover:scale-110 transition-transform" />
        Cloud<span className="font-medium text-text/80">Guardian</span>
      </Link>

      {/* Control Interface */}
      <div className="flex items-center gap-6">
        <ul className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-text/70">
          <li>
            <Link to="/login" className="hover:text-text-title transition-colors">Login</Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-text-title transition-colors">Register</Link>
          </li>
          <li>
            <Link to="/connect-aws " className="hover:text-text-title transition-colors">Connect AWS</Link>
          </li>
        </ul>

        <div className="h-4 w-[1px] bg-border" />

        {/* Toggle Pill Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl hover:bg-bg border border-transparent hover:border-border text-text-title/80 transition-all cursor-pointer"
          aria-label="Toggle theme mode"
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21m-16.78 4.78l1.58-1.58m12.42-12.42l1.58-1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.83A9.5 9.5 0 0112 21.75c-5.25 0-9.5-4.25-9.5-9.5A9.5 9.5 0 0112 2.25c.34 0 .67.02 1 .06a5.5 5.5 0 00-1.24 10.35 4.75 4.75 0 005.18 5.18 9.5 9.5 0 014.81-4.81c.04.33.06.66.06 1z" />
            </svg>
          )}
        </button>

        {/* Minimal Outlined Logout Button */}
        <button
          onClick={() => {
            alert("Logged out.");
            navigate("/login");
          }}
          className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-text-title rounded-xl text-text-title hover:bg-text-title hover:text-bg transition-all cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}