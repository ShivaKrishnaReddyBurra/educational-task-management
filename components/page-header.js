"use client"



export default function PageHeader({ title, showAddButton = true, onAddClick = () => {} }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">{title}</h1>
    </div>
  )
}