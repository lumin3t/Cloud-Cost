import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        <input type="email" placeholder="Enter your Email" className="auth-input"/>
        <input type="text" placeholder="Enter your new password" className="auth-input"/>
        <button className="auth-btn">Reset Password</button>
        <p><Link to="/">Back to Login</Link></p>
      </div>
    </div>
  );
}

export default ForgotPassword;