// components/ui/card.js

export function Card({ children, className = "" }) {
    return <div className={`bg-white border rounded-lg shadow-sm ${className}`}>{children}</div>;
  }
  
  export function CardHeader({ children, className = "" }) {
    return <div className={`p-6 border-b ${className}`}>{children}</div>;
  }
  
  export function CardTitle({ children, className = "" }) {
    return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
  }
  
  export function CardDescription({ children, className = "" }) {
    return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={`p-6 ${className}`}>{children}</div>;
  }
  
  export function CardFooter({ children, className = "" }) {
    return <div className={`p-4 border-t ${className}`}>{children}</div>;
  }
  