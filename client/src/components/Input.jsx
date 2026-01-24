export default function Input({ label, type = 'text', placeholder, value, onChange, error }) {
  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      <input
        type={type}
        className={`input input-bordered ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {error &&
        (console.log(error),
        (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        ))}
    </div>
  );
}
