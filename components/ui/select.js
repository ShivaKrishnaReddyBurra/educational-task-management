"use client";

import React, { useState } from "react";

export function Select({ children, defaultValue, onValueChange }) {
  const [value, setValue] = useState(defaultValue || "");

  const handleChange = (newValue) => {
    setValue(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { value, onValueChange: handleChange })
          : child
      )}
    </div>
  );
}

export function SelectTrigger({ children, value, onValueChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className={`border rounded px-3 py-2 w-full text-left bg-white flex items-center justify-between ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child) && child.type === SelectValue
            ? React.cloneElement(child, { value })
            : child
        )}
        <span className="ml-2">▼</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
          {React.Children.map(children, (child) =>
            React.isValidElement(child) && child.type !== SelectValue
              ? React.cloneElement(child, { value, onValueChange, setIsOpen })
              : null
          )}
        </div>
      )}
    </div>
  );
}

export function SelectValue({ placeholder, value }) {
  return <span>{value ? value.replace(/-/g, " ") : placeholder}</span>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ children, value: itemValue, onValueChange, setIsOpen }) {
  const handleClick = () => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  return (
    <div
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
