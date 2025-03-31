export default function StatusBadge({ status, className = "" }) {
    const statusStyles = {
      completed: "bg-green-100 text-green-800 border-green-200",
      "in-progress": "bg-[#dbeafe] text-[#2563eb] border-blue-200",
      pending: "bg-[#ffedd5] text-orange-800 border-orange-200",
      overdue: "bg-[#fee2e2] text-[#ef4444] border-red-200",
    };
  
    const statusText = {
      completed: "Completed",
      "in-progress": "In Progress",
      pending: "Pending",
      overdue: "Overdue",
    };
  
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]} ${className}`}
      >
        {statusText[status]}
      </span>
    );
  }
  