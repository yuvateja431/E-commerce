import React, { Component } from 'react';
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_) {
        // Update state so the next render shows the fallback UI.
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong.</h2>
          <p className="text-gray-600 mb-2">Please try refreshing the page or contact support if the problem persists.</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Reload Page
          </button>
        </div>);
        }
        return this.props.children;
    }
}
