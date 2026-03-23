import './LoadingSpinner.css';

export function LoadingSpinner() {
  return (
    <div className="spinner-wrapper" role="status" aria-label="Loading">
      <div className="spinner" />
      <span className="spinner__label">Loading…</span>
    </div>
  );
}
