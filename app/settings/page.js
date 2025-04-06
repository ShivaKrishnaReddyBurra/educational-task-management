"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { useAuth } from "../../components/auth-provider";
import { useToast } from "../../hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "",
    bio: "", // Added for profile
    preferences: { emailNotifications: true, taskReminders: true },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/me?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setFormData({
        name: data.name || "",
        email: data.email || "",
        username: data.username || "",
        password: "", // Never returned from backend for security
        role: data.role || "",
        bio: data.bio || "", // Adjust if bio isn’t in User
        preferences: data.preferences ? JSON.parse(data.preferences) : { emailNotifications: true, taskReminders: true },
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({ title: "Error", description: "Failed to load settings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePreferenceChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        ...(formData.password && { password: formData.password }), // Only include if changed
        bio: formData.bio, // Adjust if bio isn’t in User
        preferences: JSON.stringify(formData.preferences),
      };
      const res = await fetch(`${API_URL}/users/me?userId=${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      const updatedData = await res.json();
      setFormData((prev) => ({
        ...prev,
        name: updatedData.name,
        email: updatedData.email,
        username: updatedData.username,
        role: updatedData.role,
        bio: updatedData.bio || "",
        preferences: updatedData.preferences ? JSON.parse(updatedData.preferences) : prev.preferences,
        password: "", // Reset password field
      }));
      toast({ title: "Success", description: "Settings updated successfully." });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({ title: "Error", description: "Failed to update settings.", variant: "destructive" });
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <PageHeader title="Settings" showAddButton={false} />

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1f5aad]"></div>
        </div>
      ) : (
        <Tabs defaultValue="account">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password (leave blank to keep current)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={formData.role} disabled />
                  </div>

                  <Button type="submit" className="bg-[#1f5aad] hover:bg-[#1f5aad]/90 mt-4">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your public profile information.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      placeholder="Tell us about yourself"
                      value={formData.bio}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button type="submit" className="bg-[#1f5aad] hover:bg-[#1f5aad]/90 mt-4">
                    Save Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <Switch
                      id="emailNotifications"
                      checked={formData.preferences.emailNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="taskReminders">Task Reminders</Label>
                    <Switch
                      id="taskReminders"
                      checked={formData.preferences.taskReminders}
                      onCheckedChange={(checked) => handlePreferenceChange("taskReminders", checked)}
                    />
                  </div>
                  <Button type="submit" className="bg-[#1f5aad] hover:bg-[#1f5aad]/90 mt-4">
                    Save Preferences
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}