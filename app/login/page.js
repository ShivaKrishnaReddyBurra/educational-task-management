"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [role, setRole] = useState("STUDENT"); // Default to STUDENT
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [activeTab, setActiveTab] = useState("email");
  const [signShowPassword, setSignShowPassword] = useState(false);
  const [loginShowPassword, setLoginShowPassword] = useState(false);

  const evaluatePasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;           // minimum length requirement
  if (/[A-Z]/.test(password)) score++;           // uppercase letters
  if (/[0-9]/.test(password)) score++;           // digits
  if (/[\W_]/.test(password)) score++;           // special characters

  if (score <= 1) return "Weak";
  if (score === 2) return "Moderate";
  if (score >= 3) return "Strong";
  };

 

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setSignupPassword(pwd);
    setPasswordStrength(evaluatePasswordStrength(pwd));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(name, signupEmail, signupPassword, role);
      // After signup, automatically log in
      await login(signupEmail, signupPassword);
      router.push("/");
    } catch (err) {
      setError(err?.message || "Signup failed");
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
          <CardDescription>Sign in or create your educational task management account</CardDescription>
        </CardHeader>
        <CardContent>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email">Email Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Email Login Tab */}
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
                      {/* <a href="#" className="text-xs text-[#1f5aad] hover:underline">
                        Forgot password?
                      </a> */}
                    </div>
                    <div className="relative">
                      <Input
                      id="password"
                      type={loginShowPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                     <button
                      type="button"
                      
                      onClick={() => setLoginShowPassword(!loginShowPassword)}
                      className="absolute right-3 top-2.5 text-gray-600 hover:text-black"
                    >
                      {loginShowPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    </div>
                    
                  </div>
                  <Button type="submit" className="w-full bg-[#1f5aad] hover:bg-[#1f5aad]/90" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
                <br/>
                {/* <div> 
                  New User?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="text-[#1f5aad] hover:underline"
                  >
                    Sign up here
                  </button>
                  </div> */}
              </form>
            </TabsContent>

            {/* Student ID Tab (Placeholder) */}
            

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                 
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                      id="signup-password"
                      type={signShowPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={signupPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSignShowPassword(!signShowPassword)}
                      className="absolute right-3 top-2.5 text-gray-600 hover:text-black"
                    >
                      {signShowPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    </div>
                    
                    
                    {signupPassword && (
                      <p
                        className={`mt-1 text-sm ${
                          passwordStrength === "Weak"
                            ? "text-red-500"
                            : passwordStrength === "Moderate"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        Password strength: {passwordStrength}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TUTOR">Tutor</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full bg-[#1f5aad] hover:bg-[#1f5aad]/90" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                  </Button>
                </div>
                <br/>
                {/* <div> 
                  already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("email")}
                    className="text-[#1f5aad] hover:underline"
                  >
                    Sign in here
                  </button>
                  </div> */}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
      </Card>
    </div>
  );
}