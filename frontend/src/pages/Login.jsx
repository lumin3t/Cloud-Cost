import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Rainbow Decorative Blur Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full opacity-10 dark:opacity-20 blur-[90px] pointer-events-none" />

      {/* Authentication Card Wrapper */}
      <div className="w-full max-w-md bg-surface/80 backdrop-blur-md rounded-3xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 md:p-10 relative z-10 text-center">
        
        {/* Brand Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-black text-text-title tracking-tight mb-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500" />
            Cloud<span className="font-medium text-text/80">Guardian</span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-text-title mt-2">Welcome Back</h2>
        </div>

        {/* Input Interface Elements */}
        <div className="space-y-4 text-left">
          <div>
            <input 
              type="text" 
              placeholder="Email or Phone Number" 
              className="w-full p-3.5 rounded-xl border border-border bg-surface text-text-title placeholder:text-text/40 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-xs text-sm"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3.5 rounded-xl border border-border bg-surface text-text-title placeholder:text-text/40 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-xs text-sm"
            />
          </div>
        </div>

        {/* Forgot Password Helper Option */}
        <div className="text-right mt-3 mb-6">
          <Link to="/forgot-password" className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Primary Action Call */}
        <Link to="/">
          <button className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md shadow-purple-500/10 active:scale-[0.99] transition-all cursor-pointer">
            Log In
          </button>
        </Link>

        {/* Footer Redirect Navigation */}
        <p className="mt-8 text-xs text-text/70 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-text-title hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline decoration-border underline-offset-4">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;