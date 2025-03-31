// components/ui/table.js

export function Table({ children, className = "" }) {
    return <table className={`w-full text-sm text-left ${className}`}>{children}</table>;
  }
  
  export function TableHeader({ children, className = "" }) {
    return <thead className={`bg-gray-100 ${className}`}>{children}</thead>;
  }
  
  export function TableBody({ children, className = "" }) {
    return <tbody className={`${className}`}>{children}</tbody>;
  }
  
  export function TableRow({ children, className = "" }) {
    return <tr className={`border-b last:border-none ${className}`}>{children}</tr>;
  }
  
  export function TableHead({ children, className = "" }) {
    return <th className={`px-6 py-3 text-gray-600 font-medium ${className}`}>{children}</th>;
  }
  
  export function TableCell({ children, className = "" }) {
    return <td className={`px-6 py-4 ${className}`}>{children}</td>;
  }
  