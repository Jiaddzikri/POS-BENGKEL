import { ErrorBoundary } from '@/components/error-boundary';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ── helpers ───────────────────────────────────────────────────────────────────

/** Component that throws on render */
const Bomb = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Test explosion');
  return <div>All good</div>;
};

// Suppress console.error noise from React's error boundary output in tests
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─────────────────────────────────────────────────────────────────────────────

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Terjadi Kesalahan')).toBeInTheDocument();
    expect(screen.getByText(/Sesuatu yang tidak terduga/i)).toBeInTheDocument();
  });

  it('shows a reference code when error occurs', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/Kode referensi/i)).toBeInTheDocument();
  });

  it('does NOT expose raw error message or stack trace to user', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );

    // The raw error message "Test explosion" must never appear in the UI
    expect(screen.queryByText('Test explosion')).not.toBeInTheDocument();
  });

  it('shows "Coba Lagi" and "Kembali ke Beranda" buttons', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('button', { name: /Coba Lagi/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kembali ke Beranda/i })).toBeInTheDocument();
  });

  it('"Coba Lagi" resets state and re-renders children', () => {
    // Use a wrapper that controls whether Bomb throws so we can flip it
    // after clicking "Coba Lagi" without unmounting the ErrorBoundary.
    let shouldThrow = true;

    const ControlledBomb = () => {
      if (shouldThrow) throw new Error('Test explosion');
      return <div>All good</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ControlledBomb />
      </ErrorBoundary>,
    );

    // Error fallback should be visible
    expect(screen.getByText('Terjadi Kesalahan')).toBeInTheDocument();

    // Stop throwing, then click reset
    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: /Coba Lagi/i }));

    // Force a re-render so React picks up the reset state
    rerender(
      <ErrorBoundary>
        <ControlledBomb />
      </ErrorBoundary>,
    );

    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<p>Custom fallback</p>}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    expect(screen.queryByText('Terjadi Kesalahan')).not.toBeInTheDocument();
  });
});
