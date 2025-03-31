export function Label({ htmlFor, children, className = "" }) {
    return (
      <label htmlFor={htmlFor} className={`text-sm font-medium text-[#0f172a] ${className}`}>
        {children}
      </label>
    );
  }
  