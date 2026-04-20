import React from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: unknown): void {
    console.error('Unhandled UI error:', error);
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <h1 className="mb-2 text-lg font-semibold text-red-700">Something went wrong</h1>
            <p className="text-sm text-red-600">
              Please refresh the page. If the issue continues, contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
