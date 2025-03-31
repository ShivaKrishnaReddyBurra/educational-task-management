import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../components/auth-provider"
import ProtectedLayout from "../components/protected-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Education Task Management",
  description: "Education task management system",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
