export function Input({
    id,
    type = "text",
    value,
    onChange,
    defaultValue,
    className = "",
    ...props // Capture additional props like placeholder, required, etc.
  }) {
    return (
      <input
        id={id}
        type={type}
        value={value} // Use value for controlled input
        onChange={onChange} // Handle state updates
        defaultValue={defaultValue} // Fallback for uncontrolled use
        className={`border rounded px-3 py-2 w-full ${className}`}
        {...props} // Spread additional props
      />
    );
  }