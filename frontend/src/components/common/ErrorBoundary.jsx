import { Component } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="notfound" role="alert">
          <AlertTriangle size={48} color="var(--primary)" />
          <h1 style={{ fontSize: 32 }}>Something went wrong</h1>
          <p className="muted" style={{ maxWidth: 420 }}>
            An unexpected error occurred while rendering this view. You can try again or reload the page.
          </p>
          <button className="btn btn-primary" onClick={this.handleReset}>
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
