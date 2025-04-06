"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "../../components/page-header";
import StatusBadge from "../../components/status-badge";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/tabel";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from "../../components/auth-provider";
import { useToast } from "../../hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function Students() {
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isTutor = isRole("TUTOR");

  useEffect(() => {
    if (!user || !isTutor) return;
    fetchStudents();
  }, [user, isTutor]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users?role=STUDENT`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch students: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log("Parsed response from /api/users?role=STUDENT:", data);

      const formattedStudents = data.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        grade: student.grade || "N/A",
        status: student.status ? student.status.toLowerCase() : "pending",
        lastActive: student.lastActive
          ? new Date(student.lastActive).toLocaleString()
          : "Unknown",
      }));
      setStudents(formattedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive",
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;
  if (!isTutor) return <div className="p-6">Access denied. Tutors only.</div>;

  return (
    <div className="p-6">
      <PageHeader title="Students" />

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1f5aad]"></div>
        </div>
      ) : (
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
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}