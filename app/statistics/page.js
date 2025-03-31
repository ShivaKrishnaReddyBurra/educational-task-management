import PageHeader from "../../components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"

export default function Statistics() {
  return (
    <div className="p-6">
      <PageHeader title="Statistics" />

      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="weekly" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex space-x-2">
          <Select defaultValue="all-students">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-students">All Students</SelectItem>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-subjects">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-subjects">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[65, 78, 90, 82, 75, 68, 60].map((height, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 bg-[#4ade80]/20 rounded-t" style={{ height: `${height * 0.6}%` }}>
                    <div className="w-full bg-[#4ade80] rounded-t" style={{ height: `${height}%` }}></div>
                  </div>
                  <div className="text-xs text-[#64748b] mt-2">Week {i + 1}</div>
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
                {/* Horizontal grid lines */}
                {[250, 200, 150, 100, 50].map((y, i) => (
                  <line key={i} x1="50" y1={y} x2="750" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                ))}
                {/* Grade labels */}
                <text x="30" y="250" fontSize="12" fill="#64748b">
                  F
                </text>
                <text x="30" y="200" fontSize="12" fill="#64748b">
                  D
                </text>
                <text x="30" y="150" fontSize="12" fill="#64748b">
                  C
                </text>
                <text x="30" y="100" fontSize="12" fill="#64748b">
                  B
                </text>
                <text x="30" y="50" fontSize="12" fill="#64748b">
                  A
                </text>

                {/* Subject data - Math */}
                <path d="M100,120 L250,150 L400,90 L550,110 L700,80" fill="none" stroke="#3b82f6" strokeWidth="3" />
                {[
                  { x: 100, y: 120 },
                  { x: 250, y: 150 },
                  { x: 400, y: 90 },
                  { x: 550, y: 110 },
                  { x: 700, y: 80 },
                ].map((point, i) => (
                  <circle key={`math-${i}`} cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
                ))}

                {/* Subject data - Science */}
                <path d="M100,180 L250,130 L400,150 L550,100 L700,120" fill="none" stroke="#f59e0b" strokeWidth="3" />
                {[
                  { x: 100, y: 180 },
                  { x: 250, y: 130 },
                  { x: 400, y: 150 },
                  { x: 550, y: 100 },
                  { x: 700, y: 120 },
                ].map((point, i) => (
                  <circle key={`science-${i}`} cx={point.x} cy={point.y} r="4" fill="#f59e0b" />
                ))}

                {/* Subject data - English */}
                <path d="M100,200 L250,170 L400,120 L550,140 L700,100" fill="none" stroke="#ef4444" strokeWidth="3" />
                {[
                  { x: 100, y: 200 },
                  { x: 250, y: 170 },
                  { x: 400, y: 120 },
                  { x: 550, y: 140 },
                  { x: 700, y: 100 },
                ].map((point, i) => (
                  <circle key={`english-${i}`} cx={point.x} cy={point.y} r="4" fill="#ef4444" />
                ))}

                {/* X-axis labels */}
                <text x="100" y="270" fontSize="12" fill="#64748b" textAnchor="middle">
                  Q1
                </text>
                <text x="250" y="270" fontSize="12" fill="#64748b" textAnchor="middle">
                  Q2
                </text>
                <text x="400" y="270" fontSize="12" fill="#64748b" textAnchor="middle">
                  Q3
                </text>
                <text x="550" y="270" fontSize="12" fill="#64748b" textAnchor="middle">
                  Q4
                </text>
                <text x="700" y="270" fontSize="12" fill="#64748b" textAnchor="middle">
                  Final
                </text>
              </svg>
            </div>

            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#3b82f6] rounded-full mr-2"></div>
                <span className="text-sm">Mathematics</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div>
                <span className="text-sm">Science</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-2"></div>
                <span className="text-sm">English</span>
              </div>
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
                {/* Donut chart segments */}
                <circle cx="110" cy="110" r="80" fill="none" stroke="#e5e7eb" strokeWidth="30" />

                {/* A grade - 40% */}
                <circle
                  cx="110"
                  cy="110"
                  r="80"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="30"
                  strokeDasharray="502.4"
                  strokeDashoffset="301.44"
                  transform="rotate(-90 110 110)"
                />

                {/* B grade - 30% */}
                <circle
                  cx="110"
                  cy="110"
                  r="80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="30"
                  strokeDasharray="502.4"
                  strokeDashoffset="401.92"
                  transform="rotate(-90 110 110)"
                  style={{ transformOrigin: "110px 110px" }}
                  strokeDashoffset="401.92"
                />

                {/* C grade - 20% */}
                <circle
                  cx="110"
                  cy="110"
                  r="80"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="30"
                  strokeDasharray="502.4"
                  strokeDashoffset="452.16"
                  transform="rotate(-90 110 110)"
                  style={{ transformOrigin: "110px 110px" }}
                  strokeDashoffset="452.16"
                />

                {/* D & F grade - 10% */}
                <circle
                  cx="110"
                  cy="110"
                  r="80"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="30"
                  strokeDasharray="502.4"
                  strokeDashoffset="477.28"
                  transform="rotate(-90 110 110)"
                  style={{ transformOrigin: "110px 110px" }}
                  strokeDashoffset="477.28"
                />
              </svg>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#3b82f6] rounded-full mr-2"></div>
                <span className="text-sm">A (40%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#10b981] rounded-full mr-2"></div>
                <span className="text-sm">B (30%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div>
                <span className="text-sm">C (20%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-2"></div>
                <span className="text-sm">D & F (10%)</span>
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
                {/* Background grid */}
                {[250, 200, 150, 100, 50].map((y, i) => (
                  <line key={i} x1="50" y1={y} x2="750" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                ))}

                {/* Y-axis labels */}
                <text x="40" y="250" fontSize="10" fill="#64748b" textAnchor="end">
                  0%
                </text>
                <text x="40" y="200" fontSize="10" fill="#64748b" textAnchor="end">
                  25%
                </text>
                <text x="40" y="150" fontSize="10" fill="#64748b" textAnchor="end">
                  50%
                </text>
                <text x="40" y="100" fontSize="10" fill="#64748b" textAnchor="end">
                  75%
                </text>
                <text x="40" y="50" fontSize="10" fill="#64748b" textAnchor="end">
                  100%
                </text>

                {/* Early submissions */}
                <rect x="100" y="150" width="60" height="100" fill="#4ade80" />
                <text x="130" y="265" fontSize="10" fill="#64748b" textAnchor="middle">
                  Early
                </text>

                {/* On-time submissions */}
                <rect x="200" y="100" width="60" height="150" fill="#3b82f6" />
                <text x="230" y="265" fontSize="10" fill="#64748b" textAnchor="middle">
                  On-time
                </text>

                {/* Late submissions */}
                <rect x="300" y="180" width="60" height="70" fill="#f59e0b" />
                <text x="330" y="265" fontSize="10" fill="#64748b" textAnchor="middle">
                  Late
                </text>

                {/* After deadline */}
                <rect x="400" y="220" width="60" height="30" fill="#ef4444" />
                <text x="430" y="265" fontSize="10" fill="#64748b" textAnchor="middle">
                  After deadline
                </text>

                {/* Incomplete */}
                <rect x="500" y="200" width="60" height="50" fill="#64748b" />
                <text x="530" y="265" fontSize="10" fill="#64748b" textAnchor="middle">
                  Incomplete
                </text>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

