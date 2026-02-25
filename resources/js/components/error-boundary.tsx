import { Button } from '@/components/ui/button';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string | null;
}

/**
 * ErrorBoundary — catches any unhandled React render errors and shows a
 * generic, user-friendly message instead of a raw technical stack trace.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError(): State {
    // Generate a short reference ID so users can report it
    const errorId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return { hasError: true, errorId };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log to console in development only — never expose to the end user
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error, info);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, errorId: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-4">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">Terjadi Kesalahan</h2>
          <p className="mb-1 max-w-sm text-sm text-gray-500">
            Sesuatu yang tidak terduga telah terjadi. Silakan muat ulang halaman atau hubungi administrator jika masalah berlanjut.
          </p>
          {this.state.errorId && (
            <p className="mb-6 text-xs text-gray-400">
              Kode referensi: <span className="font-mono">{this.state.errorId}</span>
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={this.handleReset}>
              Coba Lagi
            </Button>
            <Button onClick={() => (window.location.href = '/')}>Kembali ke Beranda</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
