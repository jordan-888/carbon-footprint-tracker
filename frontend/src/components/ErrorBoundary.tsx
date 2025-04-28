import React from 'react';

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('UI Error:', error);
  }

  render() {
    return this.state.hasError ? (
      <div className="p-4 bg-red-50 text-red-700">
        <h2>UI Error - Please refresh</h2>
      </div>
    ) : this.props.children;
  }
}
