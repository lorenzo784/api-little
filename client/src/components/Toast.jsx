export default function Toast({ message, type = 'error', onClose }) {
  if (!message) return null;

  const alertType =
    type === 'success' ? 'alert-success' : type === 'warning' ? 'alert-warning' : 'alert-error';

  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert ${alertType} shadow-lg flex items-center gap-2`}>
        <span>{message}</span>
        <button className="btn btn-sm btn-ghost" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
