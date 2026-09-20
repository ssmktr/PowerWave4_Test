export default function Field({
  label,
  error,
  hint,
  required = false,
  children,
  htmlFor,
  addon,
}) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {required && <span className="field__required" aria-hidden="true">*</span>}
      </label>
      <div className={addon ? 'field__row' : undefined}>
        {children}
        {addon}
      </div>
      {error ? (
        <p className="field__msg field__msg--error" role="alert">{error}</p>
      ) : hint ? (
        <p className="field__msg">{hint}</p>
      ) : null}
    </div>
  )
}
