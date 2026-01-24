export default function Modal({
  open,
  title,
  children,
  onClose,
  onSave, // para formulario o confirmación
  saveText = 'Guardar',
  type = 'form', // "form" o "confirm"
  cancelText = 'Cancelar',
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mb-4">{children}</div>

        <div className="flex justify-end gap-2">
          <button className="btn btn-outline" onClick={onClose}>
            {cancelText}
          </button>

          {onSave && (
            <button
              className={`btn ${type === 'confirm' ? 'btn-error' : 'btn-primary'}`}
              onClick={onSave}
            >
              {saveText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
