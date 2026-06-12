import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Cloud Guardian</h1>
        <h2>Register Here</h2>
        <input type="text" placeholder="Full Name" className="auth-input"/>
        <input type="email" placeholder="Email" className="auth-input"/>
        <input type="text" placeholder="Phone Number" className="auth-input"/>
        <input type="text" placeholder="Country" className="auth-input"/>
        <input type="password" placeholder="Password" className="auth-input"/>
        <button className="auth-btn">Register</button>
        <p>
          Already have an account?{" "}
          <Link to="/">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;