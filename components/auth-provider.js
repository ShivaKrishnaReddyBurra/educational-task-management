"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(undefined);

const API_URL = "http://localhost:8080/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem("user");

        if (userData) {
          setUser(JSON.parse(userData));
        } else if (pathname !== "/login") {
          router.push("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  const signup = async (name, email, password, role) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      return data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log("Attempting login with:", { email, password }); // Debug log
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login response:", data); // Debug log

      const userData = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return data;
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const isRole = (role) => {
    return user?.role === role || false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};