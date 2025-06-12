"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/status-badge";
import { ArrowUpRight, Clock, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
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
  const [file, setFile] = useState(null);
  const [submission, setSubmission] = useState({
    percentageComplete: "",
    comment: "",
    submissionUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(null);
  const [openPdfViewer, setOpenPdfViewer] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [selectedPdfTitle, setSelectedPdfTitle] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
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

        if (isRole("TUTOR")) {
          const studentResponse = await fetch(`http://localhost:8080/api/users?role=STUDENT`);
          const studentText = await studentResponse.text();
          console.log("Raw response from /api/users?role=STUDENT:", studentText);
          if (!studentResponse.ok) throw new Error(`Failed to fetch students: ${taskResponse.status} - ${studentText}`);
          const studentData = JSON.parse(studentText);
          setStudents(studentData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isRole, toast]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline || newTask.assigneeIds.length === 0) {
      toast({
        title: "Error",
        description: "Title, deadline, and assignees are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        deadline: new Date(newTask.deadline).toISOString(),
        assigneeIds: newTask.assigneeIds.map(id => parseInt(id)).filter(id => !isNaN(id)),
        subject: newTask.subject || "General",
        maxScore: parseInt(newTask.maxScore) || 100,
      };

      const formData = new FormData();
      formData.append("task", JSON.stringify(taskData));
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(`http://localhost:8080/api/tasks?tutorId=${user.id}`, {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      console.log("Raw response from task creation:", text);
      if (!response.ok) throw new Error(`Failed to create task: ${response.status} - ${text}`);
      const createdTask = JSON.parse(text);
      setTasks([...tasks, createdTask]);
      setSelectedTask(createdTask);
      setNewTask({ title: "", description: "", deadline: "", assigneeIds: [], subject: "", maxScore: "" });
      setFile(null);
      setOpenTaskDialog(false);
      toast({
        title: "Success",
        description: "Task created successfully.",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast({
          title: "Error",
          description: "File size exceeds 10MB limit.",
          variant: "destructive",
        });
        e.target.value = null;
        return;
      }
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Error",
          description: "Invalid file type. Only PDF, DOC, DOCX, and TXT allowed.",
          variant: "destructive",
        });
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleStudentSelection = (studentId) => {
    setNewTask((prev) => {
      const assigneeIds = prev.assigneeIds.includes(studentId)
        ? prev.assigneeIds.filter((id) => id !== studentId)
        : [...prev.assigneeIds, studentId];
      return { ...prev, assigneeIds };
    });
  };

  const handleSubmitTask = async (taskId, e) => {
    e.preventDefault();
    try {
      const submissionData = {
        taskId,
        percentageComplete: parseInt(submission.percentageComplete) || 100,
        comment: submission.comment,
        submissionUrl: submission.submissionUrl,
      };

      const response = await fetch(`http://localhost:8080/api/progress/submit?studentId=${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const text = await response.text();
      console.log("Raw response from task submission:", text);
      if (!response.ok) throw new Error(`Failed to submit task: ${response.status} - ${text}`);
      const updatedProgress = JSON.parse(text);

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? {
            ...task,
            status: updatedProgress.percentageComplete === 100 ? "COMPLETED" : "PENDING",
            submissionUrl: updatedProgress.submissionUrl
          } : task
        )
      );
      setSubmission({ percentageComplete: "", comment: "", submissionUrl: "" });
      setOpenSubmitDialog(null);
      toast({
        title: "Success",
        description: "Progress successfully submitted.",
      });
    } catch (error) {
      console.error("Error submitting task:", error);
      toast({
        title: "Error",
        description: "Failed to submit progress.",
        variant: "destructive",
      });
    }
  };

  const handleViewPdf = (pdfUrl, title) => {
    setSelectedPdfUrl(pdfUrl);
    setSelectedPdfTitle(title);
    setOpenPdfViewer(true);
  };

  const getPdfFileName = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isRole("TUTOR") ? (
          <>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-[#64748b]">Tutor Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.name}</div>
                <div className="text-xs text-[#64748b] mt-1">{user.email}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
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
            <CardHeader className="pb-4">
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
          <CardHeader className="pb-4">
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
                <DialogContent className="bg-white max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTask} className="space-y-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">Task Title *</Label>
                        <Input
                          id="title"
                          placeholder="Enter task title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          required
                          className="border-gray-300 focus:border-[#1f5aad] focus:ring-[#1f5aad]"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                        <Input
                          id="description"
                          placeholder="Enter task description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          className="border-gray-300 focus:border-[#1f5aad] focus:ring-[#1f5aad]"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">Deadline *</Label>
                        <Input
                          id="deadline"
                          type="datetime-local"
                          value={newTask.deadline}
                          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                          required
                          className="border-gray-300 focus:border-[#1f5aad] focus:ring-[#1f5aad]"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium text-gray-700">Attachment (PDF, DOC, DOCX, TXT)</Label>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileChange}
                          className="border-gray-300 focus:border-[#1f5aad] focus:ring-[#1f5aad]"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium text-gray-700">Assign to Students *</Label>
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
                          {students.map((student) => (
                            <div key={student.id} className="flex items-center space-x-2 py-1">
                              <input
                                type="checkbox"
                                id={`student-${student.id}`}
                                value={student.id}
                                checked={newTask.assigneeIds.includes(student.id.toString())}
                                onChange={() => handleStudentSelection(student.id.toString())}
                                className="h-4 w-4 text-[#1f5aad] border-gray-300 rounded focus:ring-[#1f5aad]"
                              />
                              <label htmlFor={`student-${student.id}`} className="text-sm text-gray-700">
                                {student.name} ({student.username})
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Enter subject"
                          value={newTask.subject}
                          onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                          className="border-gray-300 focus:border-[#1f5aad] focus:ring-[#1f5aad]"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="maxScore" className="text-sm font-medium text-gray-700">Max Score</Label>
                        <Input
                          id="maxScore"
                          type="number"
                          placeholder="Enter max score"
                          value={newTask.maxScore}
                          onChange={(e) => setNewTask({ ...newTask, maxScore: e.target.value })}
                          className="border-gray-300 focus:border-[#1f5aad] focus:ring-[#1f5aad]"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-[#1f5aad] hover:bg-[#1a4a8c] text-white">
                      {loading ? "Creating..." : "Create Task"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            {selectedTask ? (
              <div className="space-y-4">
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
                {selectedTask.attachmentUrl && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Task Attachment:</span>
                      <span className="text-gray-500">{getPdfFileName(selectedTask.attachmentUrl)}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPdf(selectedTask.attachmentUrl, `${selectedTask.title} - Task Attachment`)}
                      className="h-8 px-3 text-xs border-blue-200 text-blue-700 hover:border-blue-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View PDF
                    </Button>
                  </div>
                )}
                {selectedTask.submissionUrl && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Submission:</span>
                      <span className="text-gray-500">{getPdfFileName(selectedTask.submissionUrl)}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPdf(selectedTask.submissionUrl, `${selectedTask.title} - Student Submission`)}
                      className="h-8 px-3 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Submission
                    </Button>
                  </div>
                )}
                {isRole("TUTOR") && selectedTask.assignees && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Assignees:</span>{" "}
                    {selectedTask.assignees.map((a) => a.name).join(", ")}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No task selected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading tasks...</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                    onClick={() => setSelectedTask(task)}
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-800 truncate mb-1">{task.title}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="font-medium mr-1">Due:</span>
                          <span>{new Date(task.deadline).toLocaleDateString()} at {new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                      <div className="flex items-center ml-4">
                        <StatusBadge status={task.status.toLowerCase()} />
                      </div>
                    </div>

                    {/* Action Buttons Section */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      {/* Left side - PDF Buttons */}
                      <div className="flex items-center gap-2">
                        {task.attachmentUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewPdf(task.attachmentUrl, `${task.title} - Task Attachment`);
                            }}
                            className="h-8 px-3 text-xs font-medium border-blue-200 text-blue-700  transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="h-3 w-3" />
                            Task PDF
                          </Button>
                        )}
                        {task.submissionUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewPdf(task.submissionUrl, `${task.title} - Student Submission`);
                            }}
                            className="h-8 px-3 text-xs font-medium bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all duration-200 flex items-center gap-1.5"
                          >
                            <FileText className="h-3 w-3" />
                            Submission
                          </Button>
                        )}
                      </div>

                      {/* Right side - Submit Button (for students only) */}
                      {isRole("STUDENT") && task.status !== "COMPLETED" && (
                        <Dialog
                          open={openSubmitDialog === task.id}
                          onOpenChange={(open) => setOpenSubmitDialog(open ? task.id : null)}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              onClick={(e) => e.stopPropagation()}
                              className="h-8 px-4 text-xs font-medium bg-[#1f5aad] hover:bg-[#1a4a8c] text-white transition-all duration-200"
                            >
                              Submit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white">
                            <DialogHeader>
                              <DialogTitle>Submit Task: {task.title}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e) => handleSubmitTask(task.id, e)} className="space-y-4">
                              <Input
                                placeholder="Percentage Complete (0-100)"
                                type="number"
                                min="0"
                                max="100"
                                value={submission.percentageComplete}
                                onChange={(e) =>
                                  setSubmission({ ...submission, percentageComplete: e.target.value })
                                }
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

      {/* Fixed PDF Viewer Modal */}
      <Dialog open={openPdfViewer} onOpenChange={setOpenPdfViewer}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-white overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-gray-50">
            <DialogTitle className="text-lg font-semibold text-gray-800 truncate">
              {selectedPdfTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-4 bg-gray-100">
            {selectedPdfUrl && (
              <div className="w-full h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden">
                <iframe
                  src={selectedPdfUrl}
                  className="w-full h-full border-0"
                  title={selectedPdfTitle}
                  style={{ minHeight: '600px' }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}