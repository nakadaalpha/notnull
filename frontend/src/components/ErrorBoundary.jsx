import React from 'react';
import ErrorPage from './ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
          <main className="flex-grow flex items-center justify-center pt-12 pb-12">
            <ErrorPage code={500} message={this.state.error?.message} />
          </main>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
