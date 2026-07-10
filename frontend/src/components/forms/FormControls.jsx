export function Input({ label, error, ...props }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <input className="input" {...props} />
      {error && <span style={{ color: "var(--danger)", fontSize: 12 }}>{error}</span>}
    </div>
  );
}

export function TextArea({ label, ...props }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <textarea className="textarea" rows={4} {...props} />
    </div>
  );
}

export function Select({ label, options = [], ...props }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <select className="select" {...props}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
