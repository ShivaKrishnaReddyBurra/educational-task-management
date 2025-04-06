"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useAuth } from "../../components/auth-provider";
import { useToast } from "../../hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function Reports() {
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  const [completionRates, setCompletionRates] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const isTutor = isRole("TUTOR");

  useEffect(() => {
    if (!user || !isTutor) return;
    fetchReports();
  }, [user, isTutor]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Fetch Task Completion Rate
      const completionResponse = await fetch(`${API_URL}/reports/task-completion-rate?tutorId=${user.id}`);
      if (!completionResponse.ok) {
        const errorText = await completionResponse.text();
        throw new Error(`Failed to fetch completion rates: ${errorText}`);
      }
      const completionData = await completionResponse.json();
      setCompletionRates(completionData.length ? completionData : [0, 0, 0, 0, 0, 0, 0]); // Default to 7 weeks

      // Fetch Student Progress Over Time
      const progressResponse = await fetch(`${API_URL}/reports/student-progress?tutorId=${user.id}`);
      if (!progressResponse.ok) {
        const errorText = await progressResponse.text();
        throw new Error(`Failed to fetch student progress: ${errorText}`);
      }
      const progressData = await progressResponse.json();
      setStudentProgress(progressData.length ? progressData : [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]); // Default to 10 weeks
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again.",
        variant: "destructive",
      });
      setCompletionRates([0, 0, 0, 0, 0, 0, 0]);
      setStudentProgress([0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;
  if (!isTutor) return <div className="p-6">Access denied. Tutors only.</div>;

  return (
    <div className="p-6">
      <PageHeader title="Reports" />

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1f5aad]"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {completionRates.map((rate, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 bg-[#4ade80]/20 rounded-t" style={{ height: `${rate * 0.6}%` }}>
                      <div className="w-full bg-[#4ade80] rounded-t" style={{ height: `${rate}%` }}></div>
                    </div>
                    <div className="text-xs text-[#64748b] mt-2">Week {i + 1}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 800 300">
                  <path
                    d={
                      "M50,250 " +
                      studentProgress
                        .map((progress, i) => {
                          const x = 50 + (i + 1) * 50;
                          const y = 250 - (progress * 2); // Scale 0-100% to 0-200px
                          return `L${x},${y}`;
                        })
                        .join(" ")
                    }
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="3"
                  />
                  <g>
                    {[250, 200, 150, 100, 50].map((y, i) => (
                      <line key={i} x1="50" y1={y} x2="750" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                    ))}
                  </g>
                  <g>
                    {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750].map((x, i) => (
                      <line
                        key={i}
                        x1={x}
                        y1="50"
                        x2={x}
                        y2="250"
                        stroke="#e5e7eb"
                        strokeWidth={i % 2 === 0 ? "1" : "0"}
                      />
                    ))}
                  </g>
                  {studentProgress.map((progress, i) => {
                    const x = 50 + (i + 1) * 50;
                    const y = 250 - (progress * 2);
                    return <circle key={i} cx={x} cy={y} r="4" fill="#4ade80" />;
                  })}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}