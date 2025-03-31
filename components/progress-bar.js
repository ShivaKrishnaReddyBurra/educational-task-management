export default function ProgressBar({ progress, color = "bg-[#2563eb]" }) {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
      </div>
    );
  }