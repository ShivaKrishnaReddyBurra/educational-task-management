import React from "react"
import PageHeader from "../../components/page-header"
import StatusBadge from "../../components/status-badge"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/tabel"
import { MoreHorizontal } from "lucide-react"

export default function Students() {
  const students = [
    {
      id: 1,
      name: "Alex Kim",
      email: "alex.kim@example.com",
      grade: "A",
      status: "completed",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Jordan Smith",
      email: "jordan.smith@example.com",
      grade: "B+",
      status: "in-progress",
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "Casey Johnson",
      email: "casey.johnson@example.com",
      grade: "A-",
      status: "in-progress",
      lastActive: "3 hours ago",
    },
    {
      id: 4,
      name: "Taylor Brown",
      email: "taylor.brown@example.com",
      grade: "C",
      status: "pending",
      lastActive: "5 days ago",
    },
    {
      id: 5,
      name: "Riley Davis",
      email: "riley.davis@example.com",
      grade: "B",
      status: "in-progress",
      lastActive: "Just now",
    },
  ]

  return (
    <div className="p-6">
      <PageHeader title="Students" />

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[100px]">Grade</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[150px]">Last Active</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
                <TableCell className="text-[#64748b]">{student.lastActive}</TableCell>
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
