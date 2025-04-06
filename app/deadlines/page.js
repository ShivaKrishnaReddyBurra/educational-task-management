"use client";

import { useEffect, useState } from "react";
import PageHeader from "../../components/page-header";
import ProgressBar from "../../components/progress-bar";
import StatusBadge from "../../components/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Clock } from "lucide-react";
import { useAuth } from "../../components/auth-provider";

export default function Deadlines() {
  const { user, isRole } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks based on user role
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const endpoint = isRole("STUDENT")
          ? `/api/tasks/student/${user.id}`
          : `/api/tasks/tutor/${user.id}`;
        const response = await fetch(`http://localhost:8080${endpoint}`);
        const text = await response.text();
        console.log(`Raw response from ${endpoint}:`, text);
        if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.status} - ${text}`);
        const data = JSON.parse(text);
        setTasks(data.map(task => ({
          ...task,
          progress: isRole("STUDENT")
            ? (task.progresses && task.progresses.length > 0 ? task.progresses[0].percentageComplete : 0)
            : task.status === "COMPLETED" ? 100 : 50, // Simplified for tutors
        })));
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user, isRole]);

  // Helper functions for filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // End of week (Sunday)

  const getTodayCount = () => tasks.filter(task => {
    const deadline = new Date(task.deadline);
    return deadline.toDateString() === today.toDateString() && task.status !== "COMPLETED";
  }).length;

  const getWeekCount = () => tasks.filter(task => {
    const deadline = new Date(task.deadline);
    return deadline >= today && deadline <= endOfWeek && task.status !== "COMPLETED";
  }).length;

  const getOverdueCount = () => tasks.filter(task => {
    const deadline = new Date(task.deadline);
    return deadline < today && task.status !== "COMPLETED";
  }).length;

  if (!user || loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <PageHeader title="Deadlines" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <div className="bg-white rounded-lg p-4 text-center w-24 border border-gray-100">
            <div className="text-3xl font-bold text-[#2563eb]">{getTodayCount()}</div>
            <div className="text-xs text-[#64748b] mt-1">Today</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center w-24 border border-gray-100">
            <div className="text-3xl font-bold text-[#f59e0b]">{getWeekCount()}</div>
            <div className="text-xs text-[#64748b] mt-1">This Week</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center w-24 border border-gray-100">
            <div className="text-3xl font-bold text-[#ef4444]">{getOverdueCount()}</div>
            <div className="text-xs text-[#64748b] mt-1">Overdue</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="thisWeek">This Week</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center text-xs text-[#64748b] mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(task.deadline).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={task.status.toLowerCase()} />
                </div>
                <p className="text-sm text-[#64748b] mb-3">{task.description || "No description"}</p>
                <div className="flex items-center justify-between">
                  <div className="w-full max-w-md">
                    <ProgressBar progress={task.progress} />
                  </div>
                  <span className="text-xs font-medium ml-4">{task.progress}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f1f5f9] p-8 rounded-lg text-center">
              <p className="text-[#64748b]">No deadlines found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          {tasks.filter(task => {
            const deadline = new Date(task.deadline);
            return deadline.toDateString() === today.toDateString() && task.status !== "COMPLETED";
          }).length > 0 ? (
            tasks.filter(task => {
              const deadline = new Date(task.deadline);
              return deadline.toDateString() === today.toDateString() && task.status !== "COMPLETED";
            }).map(task => (
              <div key={task.id} className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center text-xs text-[#64748b] mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(task.deadline).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={task.status.toLowerCase()} />
                </div>
                <p className="text-sm text-[#64748b] mb-3">{task.description || "No description"}</p>
                <div className="flex items-center justify-between">
                  <div className="w-full max-w-md">
                    <ProgressBar progress={task.progress} />
                  </div>
                  <span className="text-xs font-medium ml-4">{task.progress}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f1f5f9] p-8 rounded-lg text-center">
              <p className="text-[#64748b]">No deadlines due today</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="thisWeek" className="space-y-4">
          {tasks.filter(task => {
            const deadline = new Date(task.deadline);
            return deadline >= today && deadline <= endOfWeek && task.status !== "COMPLETED";
          }).length > 0 ? (
            tasks.filter(task => {
              const deadline = new Date(task.deadline);
              return deadline >= today && deadline <= endOfWeek && task.status !== "COMPLETED";
            }).map(task => (
              <div key={task.id} className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center text-xs text-[#64748b] mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(task.deadline).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={task.status.toLowerCase()} />
                </div>
                <p className="text-sm text-[#64748b] mb-3">{task.description || "No description"}</p>
                <div className="flex items-center justify-between">
                  <div className="w-full max-w-md">
                    <ProgressBar progress={task.progress} />
                  </div>
                  <span className="text-xs font-medium ml-4">{task.progress}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f1f5f9] p-8 rounded-lg text-center">
              <p className="text-[#64748b]">No deadlines due this week</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {tasks.filter(task => task.status === "COMPLETED").length > 0 ? (
            tasks.filter(task => task.status === "COMPLETED").map(task => (
              <div key={task.id} className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center text-xs text-[#64748b] mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(task.deadline).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={task.status.toLowerCase()} />
                </div>
                <p className="text-sm text-[#64748b] mb-3">{task.description || "No description"}</p>
                <div className="flex items-center justify-between">
                  <div className="w-full max-w-md">
                    <ProgressBar progress={task.progress} />
                  </div>
                  <span className="text-xs font-medium ml-4">{task.progress}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f1f5f9] p-8 rounded-lg text-center">
              <p className="text-[#64748b]">No completed deadlines</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}