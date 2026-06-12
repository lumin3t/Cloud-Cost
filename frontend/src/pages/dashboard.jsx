import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">Cloud Guardian</div>

        <ul className="nav-links">
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/cost-analysis">Cost Analysis</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>

        <button className="logout-btn">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome to Cloud Guardian</h1>
        <p>
          <h3>AI-Powered Cloud Cost Optimization Assistant</h3>
          Cloud Cost Guardian is an AI-powered cloud cost optimization platform that helps organizations monitor cloud resources, detect unnecessary spending, identify idle infrastructure, and analyze operational issues.
The system processes cloud usage, billing, and monitoring data to generate actionable insights and intelligent recommendations, helping teams reduce costs, improve resource utilization, and maintain a healthier cloud environment.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;