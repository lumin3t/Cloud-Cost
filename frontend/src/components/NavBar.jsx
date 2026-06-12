import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Cloud Guardian</Link>

      <ul className="nav-links">
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>

      <button
        className="logout-btn"
        onClick={() => {
          // placeholder logout action
          alert("Logged out (placeholder).");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </nav>
  );
}
