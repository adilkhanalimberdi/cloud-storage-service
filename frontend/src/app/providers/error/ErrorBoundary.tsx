import {Component} from "react";
import type {ErrorInfo, ReactNode} from "react";

type ErrorBoundaryProps = {
    children: ReactNode;
};

type ErrorBoundaryState = {
    error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {error: null};

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {error};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught render error:", error, errorInfo);
    }

    render() {
        const {error} = this.state;

        if (error) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-neutral-950">
                    <div className="max-w-lg space-y-3 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
                        <h1 className="text-lg font-semibold text-red-900 dark:text-red-100">
                            Что-то сломалось
                        </h1>
                        <pre className="overflow-auto whitespace-pre-wrap wrap-break-word text-sm text-red-800 dark:text-red-200">
                            {error.message}
                        </pre>
                        <button
                            type="button"
                            onClick={() => this.setState({error: null})}
                            className="rounded-lg bg-red-900 px-3 py-1.5 text-sm text-white dark:bg-red-100 dark:text-red-900"
                        >
                            Попробовать снова
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
