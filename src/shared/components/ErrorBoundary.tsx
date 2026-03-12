import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen items-center justify-center p-8 text-center">
            <div className="flex flex-col gap-3">
              <p className="text-lg font-semibold text-destructive">
                Что-то пошло не так
              </p>
              <p className="text-sm text-muted-foreground">
                {this.state.error?.message ?? "Неизвестная ошибка"}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
              >
                Перезагрузить страницу
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
