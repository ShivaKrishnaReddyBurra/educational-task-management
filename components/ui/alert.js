export function Alert({ children, variant = "info", className = "" }) {
    const getVariantClasses = (variant) => {
      switch (variant) {
        case "destructive":
          return "bg-red-100 text-red-600 border-red-400"
        case "success":
          return "bg-green-100 text-green-600 border-green-400"
        case "warning":
          return "bg-yellow-100 text-yellow-600 border-yellow-400"
        default:
          return "bg-blue-100 text-blue-600 border-blue-400"
      }
    }
  
    return (
      <div className={`flex items-center p-4 border rounded-md ${getVariantClasses(variant)} ${className}`}>
        {children}
      </div>
    )
  }
  
  export function AlertDescription({ children }) {
    return <span className="ml-2">{children}</span>
  }
  