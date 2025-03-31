"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input"; // Check this component
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        console.log("Submitting payload:", { email, password }); // Debug payload

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                router.push("/");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-[#1f5aad] rounded-full flex items-center justify-center">
                            <h1 className="text-2xl font-bold text-white">E</h1>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Edulink</CardTitle>
                    <CardDescription>Sign in to access your educational task management</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="email" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="email">Email</TabsTrigger>
                            <TabsTrigger value="student-id">Student ID</TabsTrigger>
                        </TabsList>

                        <TabsContent value="email">
                            <form onSubmit={handleLogin}>
                                {error && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            <a href="#" className="text-xs text-[#1f5aad] hover:underline">
                                                Forgot password?
                                            </a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => {
                                                console.log("Password updated:", e.target.value);
                                                setPassword(e.target.value);
                                            }}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-[#1f5aad] hover:bg-[#1f5aad]/90" disabled={loading}>
                                        {loading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>

                        <TabsContent value="student-id">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="student-id">Student ID</Label>
                                    <Input id="student-id" type="text" placeholder="Enter your student ID" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-id">Password</Label>
                                    <Input id="password-id" type="password" />
                                </div>
                                <Button className="w-full bg-[#1f5aad] hover:bg-[#1f5aad]/90">Sign In with Student ID</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-[#64748b]">
                        Don't have an account?{" "}
                        <a href="#" className="text-[#1f5aad] hover:underline">
                            Contact administrator
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}