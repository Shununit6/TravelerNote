import { Component } from 'react';
import { Link } from 'react-router-dom';

class GlobeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Globe failed to render:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="globe-fallback">
          <h2>Welcome to Traveler Note</h2>
          <p>Map view is unavailable on this device.</p>
          <div className="globe-fallback-links">
            <Link to="/plans">Explore Plans</Link>
            <Link to="/places">Explore Places</Link>
            <Link to="/stories">Explore Stories</Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default GlobeErrorBoundary;
