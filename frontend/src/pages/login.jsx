import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Cloud Guardian</h1>
        <h2>Log In</h2>

        <input type="text" placeholder="Email or Phone Number" className="auth-input"/>
        <input type="password" placeholder="Password" className="auth-input"/>
        <button className="auth-btn">Log In</button>
        <p className="forgot">
  <Link to="/forgot-password">Forgot Password?</Link>
</p>
        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
export default Login;