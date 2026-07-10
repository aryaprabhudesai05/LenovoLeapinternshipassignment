import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <h3>This page wandered off.</h3>
      <p className="muted">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn btn-primary mt-2">
        Back to Dashboard
      </Link>
    </div>
  );
}
