"use client"


import { PlusCircle } from "lucide-react"

export default function PageHeader({ title, showAddButton = true, onAddClick = () => {} }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">{title}</h1>
      {showAddButton && (
        <button onClick={onAddClick} className="bg-[#1f5aad] hover:bg-[#1f5aad]/90">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New
        </button>
      )}
    </div>
  )
}