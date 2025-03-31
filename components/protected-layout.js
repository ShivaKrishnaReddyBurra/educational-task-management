"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"
import Sidebar from "../components/sidebar"

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until the initial client-side render
  if (!mounted) return null

  // Don't apply layout to login page
  if (pathname === "/login") {
    return <>{children}</>
  }

  // If loading, show a spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1f5aad]"></div>
      </div>
    )
  }

  // Render protected layout with sidebar
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#fafafa]">{children}</main>
    </div>
  )
}
