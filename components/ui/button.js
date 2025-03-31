export function Button({ children, onClick, className = "" }) {
    return (
      <button
        onClick={onClick}
        className={`bg-[#1f5aad] hover:bg-[#1f5aad]/90 text-white py-2 px-4 rounded ${className}`}
      >
        {children}
      </button>
    );
  }
  