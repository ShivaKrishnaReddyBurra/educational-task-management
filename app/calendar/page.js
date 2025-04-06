"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../components/auth-provider";
import { useToast } from "../../hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function Calendar() {
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const role = isRole("TUTOR") ? "TUTOR" : isRole("STUDENT") ? "STUDENT" : null;

  useEffect(() => {
    if (!user || !role) return;
    fetchCalendarData();
  }, [user, role, currentDate]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // JavaScript months are 0-based

      // Fetch tasks for the month
      const tasksRes = await fetch(
        `${API_URL}/calendar/tasks?userId=${user.id}&role=${role}&year=${year}&month=${month}`
      );
      if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
      const tasksData = await tasksRes.json();
      setTasks(tasksData);

      // Fetch upcoming events
      const from = currentDate.toISOString().split("T")[0] + "T00:00:00";
      const eventsRes = await fetch(
        `${API_URL}/calendar/upcoming?userId=${user.id}&role=${role}&from=${from}`
      );
      if (!eventsRes.ok) throw new Error("Failed to fetch upcoming events");
      const eventsData = await eventsRes.json();
      setUpcomingEvents(eventsData);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      toast({ title: "Error", description: "Failed to load calendar data.", variant: "destructive" });
      setTasks([]);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + delta)));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentDate.getFullYear() && today.getMonth() === currentDate.getMonth();

  if (!user) return <div className="p-6">Loading...</div>;
  if (!role) return <div className="p-6">Access denied. Tutors or Students only.</div>;

  return (
    <div className="p-6">
      <PageHeader title="Calendar" />

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1f5aad]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekdays.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-[#64748b]">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10 rounded-md"></div>
                  ))}
                  {days.map((day) => {
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isToday = isCurrentMonth && day === today.getDate();
                    const hasEvent = tasks.some(task => task.deadline.startsWith(dateStr));

                    return (
                      <div
                        key={day}
                        className={`h-10 flex items-center justify-center rounded-md text-sm ${
                          isToday
                            ? "bg-[#1f5aad] text-white"
                            : hasEvent
                              ? "bg-[#dbeafe] text-[#1f5aad]"
                              : "hover:bg-gray-100"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-[#64748b]">No upcoming events.</p>
                  ) : (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="text-sm text-[#64748b] mt-1">
                          {new Date(event.deadline).toLocaleDateString()} at{" "}
                          {new Date(event.deadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}