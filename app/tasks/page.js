"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/page-header";
import StatusBadge from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tabel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function Tasks() {
  const { toast } = useToast();
  const { user, isRole } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    subject: "",
    assigneeIds: [],
  });
  const [file, setFile] = useState(null);
  const [submitData, setSubmitData] = useState({
    taskId: 0,
    comment: "",
    file: null,
  });
  const [gradeData, setGradeData] = useState({
    score: "",
    feedback: "",
  });

  const isTutor = isRole("TUTOR");
  const isStudent = isRole("STUDENT");

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    if (isTutor) fetchStudents();
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const endpoint = isStudent
        ? `${API_URL}/tasks/student/${user.id}`
        : `${API_URL}/tasks/tutor/${user.id}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch tasks: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log(`Parsed response from ${endpoint}:`, data);
      const formattedTasks = data.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: new Date(task.deadline).toISOString().split("T")[0],
        assignedTo: task.assignees ? task.assignees.map(a => a.username).join(", ") : "None",
        status: task.status.toLowerCase(),
        subject: task.subject || "General",
        attachmentUrl: task.attachmentUrl || null,
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/users?role=STUDENT`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch students: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log("Parsed response from /api/users?role=STUDENT:", data);
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to load students.",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (task) => {
    if (task) {
      setSelectedTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        subject: task.subject,
        assigneeIds: task.assignees ? task.assignees.map(a => a.id.toString()) : [],
      });
      setFile(null);
    } else {
      setSelectedTask(null);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        subject: "",
        assigneeIds: [],
      });
      setFile(null);
    }
    setIsDialogOpen(true);
  };

  const handleOpenSubmitDialog = (task) => {
    setSelectedTask(task);
    setSubmitData({
      taskId: task.id,
      comment: "",
      file: null,
    });
    setIsSubmitDialogOpen(true);
  };

  const handleOpenGradeDialog = async (task) => {
    try {
      const response = await fetch(`${API_URL}/progress/task/${task.id}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch progress: ${errorText}`);
      }
      const progressData = await response.json();
      if (progressData.length > 0) {
        setSelectedProgress(progressData[0]); // Assuming one progress per student per task for simplicity
        setGradeData({
          score: progressData[0].score || "",
          feedback: progressData[0].comment || "",
        });
        setIsGradeDialogOpen(true);
      } else {
        toast({
          title: "No Submission",
          description: "No submissions found for this task.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast({
        title: "Error",
        description: "Failed to load submission.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024;
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

  const handleSubmissionFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024;
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
      setSubmitData((prev) => ({ ...prev, file: selectedFile }));
    }
  };

  const handleSubmitInputChange = (e) => {
    const { name, value } = e.target;
    setSubmitData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeInputChange = (e) => {
    const { name, value } = e.target;
    setGradeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssigneeChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData((prev) => ({ ...prev, assigneeIds: selectedOptions }));
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      const method = selectedTask ? "PUT" : "POST";
      const endpoint = selectedTask
        ? `${API_URL}/tasks/${selectedTask.id}?tutorId=${user.id}`
        : `${API_URL}/tasks?tutorId=${user.id}`;

      const taskData = {
        title: formData.title,
        description: formData.description,
        deadline: new Date(formData.dueDate).toISOString(),
        subject: formData.subject || "General",
        assigneeIds: formData.assigneeIds.map(id => parseInt(id)),
      };

      const formDataToSend = new FormData();
      formDataToSend.append("task", JSON.stringify(taskData));
      if (file) {
        formDataToSend.append("file", file);
      }

      const response = await fetch(endpoint, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(selectedTask ? `Failed to update task: ${errorText}` : `Failed to create task: ${errorText}`);
      }
      const data = await response.json();
      console.log(`Parsed response from ${endpoint}:`, data);

      setIsDialogOpen(false);
      setFile(null);
      fetchTasks();

      toast({
        title: "Success",
        description: selectedTask ? "Task updated successfully" : "Task created successfully",
      });
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: "Error",
        description: selectedTask ? "Failed to update task" : "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleSubmitProgress = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        taskId: submitData.taskId,
        comment: submitData.comment,
      };

      const formData = new FormData();
      formData.append("submission", JSON.stringify(submissionData));
      if (submitData.file) {
        formData.append("file", submitData.file);
      }

      const response = await fetch(`${API_URL}/progress/submit?studentId=${user.id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit progress: ${errorText}`);
      }
      const data = await response.json();
      console.log("Parsed response from progress submission:", data);

      setIsSubmitDialogOpen(false);
      fetchTasks();

      toast({
        title: "Success",
        description: "Progress submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting progress:", error);
      toast({
        title: "Error",
        description: "Failed to submit progress",
        variant: "destructive",
      });
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/progress/grade/${selectedProgress.id}?tutorId=${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: parseInt(gradeData.score),
          feedback: gradeData.feedback,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to grade submission: ${errorText}`);
      }
      const data = await response.json();
      console.log("Parsed response from grade submission:", data);

      setIsGradeDialogOpen(false);
      fetchTasks();

      toast({
        title: "Success",
        description: "Submission graded successfully",
      });
    } catch (error) {
      console.error("Error grading submission:", error);
      toast({
        title: "Error",
        description: "Failed to grade submission",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}?tutorId=${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete task: ${errorText}`);
      }
      console.log(`Response from delete ${taskId}:`, "Task deleted");

      fetchTasks();

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <PageHeader title="Tasks" showAddButton={isTutor} onAddClick={() => handleOpenDialog()} />

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1f5aad]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Task Title</TableHead>
                <TableHead className="w-[150px]">Due Date</TableHead>
                <TableHead className="w-[200px]">Assigned To</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[150px]">Attachment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>
                      <StatusBadge status={task.status} />
                    </TableCell>
                    <TableCell>
                      {task.attachmentUrl ? (
                        <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Download Attachment
                        </a>
                      ) : (
                        "None"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTask ? "Edit Task" : "Create New Task"}</DialogTitle>
            <DialogDescription>
              {selectedTask ? "Update the task details below." : "Fill in the details for the new task."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitTask}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">Attachment (Optional)</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
              </div>
              {isTutor && (
                <div className="grid gap-2">
                  <Label htmlFor="assigneeIds">Assign To</Label>
                  <select
                    id="assigneeIds"
                    multiple
                    value={formData.assigneeIds}
                    onChange={handleAssigneeChange}
                    className="w-full p-2 border rounded h-32"
                    required
                  >
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.username})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedTask ? "Update Task" : "Create Task"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit Progress</DialogTitle>
            <DialogDescription>Update your progress for: {selectedTask?.title}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitProgress}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="comment">Comments</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  value={submitData.comment}
                  onChange={handleSubmitInputChange}
                  rows={3}
                  placeholder="Add any comments about your progress"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">Submission File</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleSubmissionFileChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Progress</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>Grade the submission for: {selectedProgress?.task.title}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGradeSubmission}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="submissionFile">Submission File</Label>
                {selectedProgress?.submissionFileUrl ? (
                  <a href={selectedProgress.submissionFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Download Submission
                  </a>
                ) : (
                  <span>No file submitted</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="score">Score</Label>
                <Input
                  id="score"
                  name="score"
                  type="number"
                  min="0"
                  max="100"
                  value={gradeData.score}
                  onChange={handleGradeInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  value={gradeData.feedback}
                  onChange={handleGradeInputChange}
                  rows={3}
                  placeholder="Add feedback for the submission"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsGradeDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Grade</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}