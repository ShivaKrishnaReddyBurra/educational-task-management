import PageHeader from "../../components/page-header"
import StatusBadge from "../../components/status-badge"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/tabel"
import { MoreHorizontal } from "lucide-react"

export default function Tasks() {
  const tasks = [
    {
      id: 1,
      title: "Mid-Term Exam",
      dueDate: "2023-03-15",
      assignedTo: "All Students",
      status: "pending",
    },
    {
      id: 2,
      title: "Physics Lab Report",
      dueDate: "2023-03-18",
      assignedTo: "Physics Class",
      status: "in-progress",
    },
    {
      id: 3,
      title: "History Essay",
      dueDate: "2023-03-20",
      assignedTo: "History Class",
      status: "in-progress",
    },
    {
      id: 4,
      title: "Math Quiz",
      dueDate: "2023-03-22",
      assignedTo: "Math Class",
      status: "completed",
    },
  ]

  return (
    <div className="p-6">
      <PageHeader title="Tasks" />

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Task Title</TableHead>
              <TableHead className="w-[150px]">Due Date</TableHead>
              <TableHead className="w-[200px]">Assigned To</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}