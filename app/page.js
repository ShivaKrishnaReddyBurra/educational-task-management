"use client";

import { useEffect, useState } from "react";
import PageHeader from "../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import StatusBadge from "../components/status-badge";
import { ArrowUpRight, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../components/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const { user, isRole } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    assigneeIds: [],
    subject: "",
    maxScore: "",
  });
  const [submission, setSubmission] = useState({
    percentageComplete: "",
    comment: "",
    submissionUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(null);

  // Fetch tasks and students based on user role
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tasks
        const taskEndpoint = isRole("STUDENT")
          ? `/api/tasks/student/${user.id}`
          : `/api/tasks/tutor/${user.id}`;
        const taskResponse = await fetch(`http://localhost:8080${taskEndpoint}`);
        const taskText = await taskResponse.text();
        console.log(`Raw response from ${taskEndpoint}:`, taskText);
        if (!taskResponse.ok) throw new Error(`Failed to fetch tasks: ${taskResponse.status} - ${taskText}`);
        const taskData = JSON.parse(taskText);
        setTasks(taskData);
        setSelectedTask(taskData.length > 0 ? taskData[taskData.length - 1] : null);

        // Fetch students (for tutors only)
        if (isRole("TUTOR")) {
          const studentResponse = await fetch(`http://localhost:8080/api/users?role=STUDENT`);
          const studentText = await studentResponse.text();
          console.log("Raw response from /api/users?role=STUDENT:", studentText);
          if (!studentResponse.ok) throw new Error(`Failed to fetch students: ${studentResponse.status} - ${studentText}`);
          const studentData = JSON.parse(studentText);
          setStudents(studentData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isRole]);

  // Handle task creation (Tutor)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline || newTask.assigneeIds.length === 0) return;

    try {
      const response = await fetch(`http://localhost:8080/api/tasks?tutorId=${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          deadline: newTask.deadline,
          assigneeIds: newTask.assigneeIds.map(id => parseInt(id)),
          subject: newTask.subject || "General",
          maxScore: parseInt(newTask.maxScore) || 100,
        }),
      });
      const text = await response.text();
      console.log("Raw response from task creation:", text);
      if (!response.ok) throw new Error(`Failed to create task: ${response.status} - ${text}`);
      const createdTask = JSON.parse(text);
      setTasks([...tasks, createdTask]);
      setSelectedTask(createdTask);
      setNewTask({ title: "", description: "", deadline: "", assigneeIds: [], subject: "", maxScore: "" });
      setOpenTaskDialog(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Handle task submission (Student)
  const handleSubmitTask = async (taskId, e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/progress/submit?studentId=${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          percentageComplete: parseInt(submission.percentageComplete) || 100,
          comment: submission.comment,
          submissionUrl: submission.submissionUrl,
        }),
      });
      const text = await response.text();
      console.log("Raw response from task submission:", text);
      if (!response.ok) throw new Error(`Failed to submit task: ${response.status} - ${text}`);
      const updatedProgress = JSON.parse(text);
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: updatedProgress.percentageComplete === 100 ? "COMPLETED" : "PENDING" } : task
        )
      );
      setSubmission({ percentageComplete: "", comment: "", submissionUrl: "" });
      setOpenSubmitDialog(null);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <PageHeader title="Dashboard" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isRole("TUTOR") ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#64748b]">Tutor Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.name}</div>
                <div className="text-xs text-[#64748b] mt-1">{user.email}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#64748b]">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
                <div className="text-xs text-[#64748b] mt-1">Active students</div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b]">Total Assigned Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <div className="text-xs text-[#64748b] mt-1">
                <span className="text-green-500 flex items-center">
                  +{tasks.length > 0 ? 1 : 0}% <ArrowUpRight className="h-3 w-3 ml-1" />
                </span>
                from last update
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="text-xs text-[#64748b] mt-1">
              <span className="text-green-500 flex items-center">
                +{tasks.length > 0 ? 1 : 0}% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>
              from last update
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Details/Create Section */}
        <Card>
          <CardHeader>
            <CardTitle>{isRole("TUTOR") ? "Task Details" : "Your Progress"}</CardTitle>
          </CardHeader>
          <CardContent>
            {isRole("TUTOR") && (
              <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
                <DialogTrigger asChild>
                  <Button className="mb-4">Add New Task</Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <Input
                      placeholder="Task Title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <Input
                      type="datetime-local"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                      required
                    />
                    <select
                      multiple
                      value={newTask.assigneeIds}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          assigneeIds: Array.from(e.target.selectedOptions, option => option.value),
                        })
                      }
                      className="w-full p-2 border rounded h-32" // Increased height for better visibility
                      required
                    >
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.username})
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="Subject"
                      value={newTask.subject}
                      onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                    />
                    <Input
                      placeholder="Max Score"
                      type="number"
                      value={newTask.maxScore}
                      onChange={(e) => setNewTask({ ...newTask, maxScore: e.target.value })}
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Task"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            {selectedTask ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">{selectedTask.title}</h3>
                <p className="text-sm text-gray-600 italic">{selectedTask.description || "No description provided"}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-medium">Due:</span> {new Date(selectedTask.deadline).toLocaleString()}
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-700 mr-2">Status:</span>
                  <StatusBadge status={selectedTask.status.toLowerCase()} />
                </div>
                {isRole("TUTOR") && selectedTask.assignees && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Assignees:</span> {selectedTask.assignees.map(a => a.username).join(", ")}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No task selected</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading tasks...</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto"> {/* Fixed height with scroll */}
                {tasks.map((task) => ( // Limit to 7 tasks
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div>
                      <h3 className="font-medium text-sm text-gray-800">{task.title}</h3>
                      <div className="flex items-center text-xs text-[#64748b] mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(task.deadline).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={task.status.toLowerCase()} />
                      {isRole("STUDENT") && task.status !== "COMPLETED" && (
                        <Dialog open={openSubmitDialog === task.id} onOpenChange={(open) => setOpenSubmitDialog(open ? task.id : null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={(e) => e.stopPropagation()}>Submit</Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white">
                            <DialogHeader>
                              <DialogTitle>Submit Task: {task.title}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => handleSubmitTask(task.id, e)} className="space-y-4">
                              <Input
                                placeholder="Percentage Complete (0-100)"
                                type="number"
                                value={submission.percentageComplete}
                                onChange={(e) => setSubmission({ ...submission, percentageComplete: e.target.value })}
                                required
                              />
                              <Input
                                placeholder="Comment"
                                value={submission.comment}
                                onChange={(e) => setSubmission({ ...submission, comment: e.target.value })}
                              />
                              <Input
                                placeholder="Submission URL"
                                value={submission.submissionUrl}
                                onChange={(e) => setSubmission({ ...submission, submissionUrl: e.target.value })}
                              />
                              <Button type="submit" disabled={loading}>
                                {loading ? "Submitting..." : "Submit"}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}