"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { BarChart3, Calendar, ClipboardList, Clock, Home, LogOut, PieChart, Settings, Users } from "lucide-react";
import { Button } from "./ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isRole } = useAuth();

  // Define navigation items, conditionally including Reports and Statistics for tutors only
  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Deadlines", href: "/deadlines", icon: Clock },
    { name: "Tasks", href: "/tasks", icon: ClipboardList },
    ...(isRole("TUTOR") ? [{ name: "Students", href: "/students", icon: Users }] : []), // Only tutors see "Students"
    // Conditionally add Reports and Statistics for tutors only
    ...(isRole("TUTOR") ? [
      { name: "Reports", href: "/reports", icon: BarChart3 },
      { name: "Statistics", href: "/statistics", icon: PieChart },
    ] : []),
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#1f5aad] text-white flex flex-col h-full">
      <div className="p-4 border-b border-blue-700">
        <h1 className="text-xl font-bold">Edulink</h1>
      </div>

      {user && user.name && (
        <div className="p-4 border-b border-blue-700 flex items-center">
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center font-bold mr-3">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-blue-200">
              {user.role.toLowerCase()} {/* Display single role */}
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 pt-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm ${
                    isActive ? "bg-blue-700 font-medium" : "hover:bg-blue-700/50"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-blue-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-blue-700/50 px-4"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </Button>
      </div>

      <div className="p-4 text-xs text-blue-200">
        <p>© 2023 Edulink</p>
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
}