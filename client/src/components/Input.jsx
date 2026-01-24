export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        type={type}
        className="input input-bordered"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
