'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            fontFamily: 'system-ui, sans-serif',
            background: '#F1F5F9',
          }}
        >
          <div
            style={{
              maxWidth: '28rem',
              width: '100%',
              background: '#fff',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }}
          >
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Application error
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              The app hit a critical error. Please refresh or try again.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                background: '#00B078',
                color: '#fff',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem 1.25rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
