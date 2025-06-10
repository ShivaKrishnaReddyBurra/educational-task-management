"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAuth } from "../../components/auth-provider";
import { useToast } from "../../hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function Statistics() {
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  const [period, setPeriod] = useState("weekly");
  const [studentId, setStudentId] = useState(null); // null for all students
  const [subject, setSubject] = useState("all-subjects");
  const [completionRates, setCompletionRates] = useState([]);
  const [subjectPerformance, setSubjectPerformance] = useState({});
  const [gradeDistribution, setGradeDistribution] = useState({});
  const [submissionTimeline, setSubmissionTimeline] = useState({});
  const [loading, setLoading] = useState(true);

  const isTutor = isRole("TUTOR");

  useEffect(() => {
    if (!user || !isTutor) return;
    fetchStatistics();
  }, [user, isTutor, period, studentId, subject]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tutorId: user.id });
      if (studentId) params.append("studentId", studentId);
      params.append("subject", subject);
      params.append("period", period);

      // Task Completion Rate
      const completionRes = await fetch(`${API_URL}/statistics/task-completion-rate?${params}`);
      if (!completionRes.ok) throw new Error("Failed to fetch completion rates");
      const completionData = await completionRes.json();
      setCompletionRates(completionData.length ? completionData : [0, 0, 0, 0, 0, 0, 0]);

      // Subject Performance
      const subjectRes = await fetch(`${API_URL}/statistics/subject-performance?${params}`);
      if (!subjectRes.ok) throw new Error("Failed to fetch subject performance");
      const subjectData = await subjectRes.json();
      setSubjectPerformance(subjectData);

      // Grade Distribution
      const gradeRes = await fetch(`${API_URL}/statistics/grade-distribution?${params}`);
      if (!gradeRes.ok) throw new Error("Failed to fetch grade distribution");
      const gradeData = await gradeRes.json();
      console.log("Grade Distribution Raw Data:", gradeData); // Debug raw data
      // Ensure all values are numbers
      const normalizedGradeData = {
        A: Number(gradeData["A"] || 0),
        B: Number(gradeData["B"] || 0),
        C: Number(gradeData["C"] || 0),
        "D & F": Number(gradeData["D & F"] || 0),
      };
      setGradeDistribution(normalizedGradeData);

      // Submission Timeline
      const timelineRes = await fetch(`${API_URL}/statistics/submission-timeline?${params}`);
      if (!timelineRes.ok) throw new Error("Failed to fetch submission timeline");
      const timelineData = await timelineRes.json();
      setSubmissionTimeline(timelineData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast({ title: "Error", description: "Failed to load statistics.", variant: "destructive" });
      setCompletionRates([0, 0, 0, 0, 0, 0, 0]);
      setSubjectPerformance({ Mathematics: [0, 0, 0, 0, 0], Science: [0, 0, 0, 0, 0], English: [0, 0, 0, 0, 0] });
      setGradeDistribution({ A: 0, B: 0, C: 0, "D & F": 0 });
      setSubmissionTimeline({ Early: 0, "On-time": 0, Late: 0, "After deadline": 0, Incomplete: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;
  if (!isTutor) return <div className="p-6">Access denied. Tutors only.</div>;

  return (
    <div className="p-6">
      <PageHeader title="Statistics" />

      <div className="flex justify-between items-center mb-6">
        <Tabs value={period} onValueChange={setPeriod} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex space-x-2">
          <Select value={studentId || "all-students"} onValueChange={(val) => setStudentId(val === "all-students" ? null : val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-students">All Students</SelectItem>
              {/* Dynamically fetch students in a real app */}
              <SelectItem value="1">John Doe</SelectItem>
              <SelectItem value="2">Jane Smith</SelectItem>
            </SelectContent>
          </Select>

          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-subjects">All Subjects</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="English">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1f5aad]"></div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {completionRates.map((rate, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-10 bg-[#4ade80]/20 rounded-t" style={{ height: `${rate * 0.6}%` }}>
                        <div className="w-full bg-[#4ade80] rounded-t" style={{ height: `${rate}%` }}></div>
                      </div>
                      <div className="text-xs text-[#64748b] mt-2">
                        {period === "daily" ? `Day ${i + 1}` : period === "weekly" ? `Week ${i + 1}` : period === "monthly" ? `Month ${i + 1}` : `Year ${i + 2020}`}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  <svg className="w-full h-full" viewBox="0 0 800 300">
                    {[250, 200, 150, 100, 50].map((y, i) => (
                      <line key={i} x1="50" y1={y} x2="750" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                    ))}
                    <text x="30" y="250" fontSize="12" fill="#64748b">F</text>
                    <text x="30" y="200" fontSize="12" fill="#64748b">D</text>
                    <text x="30" y="150" fontSize="12" fill="#64748b">C</text>
                    <text x="30" y="100" fontSize="12" fill="#64748b">B</text>
                    <text x="30" y="50" fontSize="12" fill="#64748b">A</text>

                    {Object.entries(subjectPerformance).map(([subj, grades], idx) => {
                      const color = subj === "Mathematics" ? "#3b82f6" : subj === "Science" ? "#f59e0b" : "#ef4444";
                      const path = `M100,${250 - (grades[0] || 0) * 2} ` + grades.slice(1).map((g, i) => `L${100 + (i + 1) * 150},${250 - (g || 0) * 2}`).join(" ");
                      return (
                        <React.Fragment key={subj}>
                          <path d={path} fill="none" stroke={color} strokeWidth="3" />
                          {grades.map((g, i) => (
                            <circle key={i} cx={100 + i * 150} cy={250 - (g || 0) * 2} r="4" fill={color} />
                          ))}
                        </React.Fragment>
                      );
                    })}

                    {[100, 250, 400, 550, 700].map((x, i) => (
                      <text key={i} x={x} y="270" fontSize="12" fill="#64748b" textAnchor="middle">
                        {["Q1", "Q2", "Q3", "Q4", "Final"][i]}
                      </text>
                    ))}
                  </svg>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {Object.keys(subjectPerformance).map((subj) => (
                    <div key={subj} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: subj === "Mathematics" ? "#3b82f6" : subj === "Science" ? "#f59e0b" : "#ef4444" }}
                      ></div>
                      <span className="text-sm">{subj}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <svg width="220" height="220" viewBox="0 0 220 220">
                    <circle cx="110" cy="110" r="80" fill="none" stroke="#e5e7eb" strokeWidth="30" />
                    <circle
                      cx="110"
                      cy="110"
                      r="80"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="30"
                      strokeDasharray="502.4"
                      strokeDashoffset={502.4 - (gradeDistribution["A"] || 0) * 5.024}
                      transform="rotate(-90 110 110)"
                    />
                    <circle
                      cx="110"
                      cy="110"
                      r="80"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="30"
                      strokeDasharray="502.4"
                      strokeDashoffset={502.4 - ((gradeDistribution["B"] || 0) + (gradeDistribution["A"] || 0)) * 5.024}
                      transform="rotate(-90 110 110)"
                    />
                    <circle
                      cx="110"
                      cy="110"
                      r="80"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="30"
                      strokeDasharray="502.4"
                      strokeDashoffset={
                        502.4 - ((gradeDistribution["C"] || 0) + (gradeDistribution["B"] || 0) + (gradeDistribution["A"] || 0)) * 5.024
                      }
                      transform="rotate(-90 110 110)"
                    />
                    <circle
                      cx="110"
                      cy="110"
                      r="80"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="30"
                      strokeDasharray="502.4"
                      strokeDashoffset={
                        502.4 -
                        ((gradeDistribution["D & F"] || 0) + (gradeDistribution["C"] || 0) + (gradeDistribution["B"] || 0) + (gradeDistribution["A"] || 0)) *
                          5.024
                      }
                      transform="rotate(-90 110 110)"
                    />
                  </svg>
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#3b82f6] rounded-full mr-2"></div>
                    <span className="text-sm">A ({Number(gradeDistribution["A"] || 0).toFixed(1)}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#10b981] rounded-full mr-2"></div>
                    <span className="text-sm">B ({Number(gradeDistribution["B"] || 0).toFixed(1)}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div>
                    <span className="text-sm">C ({Number(gradeDistribution["C"] || 0).toFixed(1)}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-2"></div>
                    <span className="text-sm">D & F ({Number(gradeDistribution["D & F"] || 0).toFixed(1)}%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Submission Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  <svg className="w-full h-full" viewBox="0 0 800 300">
                    {[250, 200, 150, 100, 50].map((y, i) => (
                      <line key={i} x1="50" y1={y} x2="750" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                    ))}
                    <text x="40" y="250" fontSize="10" fill="#64748b" textAnchor="end">0%</text>
                    <text x="40" y="200" fontSize="10" fill="#64748b" textAnchor="end">25%</text>
                    <text x="40" y="150" fontSize="10" fill="#64748b" textAnchor="end">50%</text>
                    <text x="40" y="100" fontSize="10" fill="#64748b" textAnchor="end">75%</text>
                    <text x="40" y="50" fontSize="10" fill="#64748b" textAnchor="end">100%</text>

                    <rect x="100" y={250 - (submissionTimeline["Early"] || 0) * 2.5} width="60" height={(submissionTimeline["Early"] || 0) * 2.5} fill="#4ade80" />
                    <text x="130" y="265" fontSize="10" fill="#64748b" textAnchor="middle">Early</text>

                    <rect x="200" y={250 - (submissionTimeline["On-time"] || 0) * 2.5} width="60" height={(submissionTimeline["On-time"] || 0) * 2.5} fill="#3b82f6" />
                    <text x="230" y="265" fontSize="10" fill="#64748b" textAnchor="middle">On-time</text>

                    <rect x="300" y={250 - (submissionTimeline["Late"] || 0) * 2.5} width="60" height={(submissionTimeline["Late"] || 0) * 2.5} fill="#f59e0b" />
                    <text x="330" y="265" fontSize="10" fill="#64748b" textAnchor="middle">Late</text>

                    <rect
                      x="400"
                      y={250 - (submissionTimeline["After deadline"] || 0) * 2.5}
                      width="60"
                      height={(submissionTimeline["After deadline"] || 0) * 2.5}
                      fill="#ef4444"
                    />
                    <text x="430" y="265" fontSize="10" fill="#64748b" textAnchor="middle">After deadline</text>

                    <rect x="500" y={250 - (submissionTimeline["Incomplete"] || 0) * 2.5} width="60" height={(submissionTimeline["Incomplete"] || 0) * 2.5} fill="#64748b" />
                    <text x="530" y="265" fontSize="10" fill="#64748b" textAnchor="middle">Incomplete</text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}