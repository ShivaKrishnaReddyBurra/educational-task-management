import PageHeader from "../components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import StatusBadge from "../components/status-badge"
import { ArrowUpRight, Clock } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="p-6">
      <PageHeader title="Dashboard" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <div className="text-xs text-[#64748b] mt-1">
              <span className="text-green-500 flex items-center">
                +5% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>
              from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <div className="text-xs text-[#64748b] mt-1">
              <span className="text-green-500 flex items-center">
                +2% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span>
              from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <div className="text-xs text-[#64748b] mt-1">
              <span className="text-red-500 flex items-center">
                -3% <ArrowUpRight className="h-3 w-3 ml-1 rotate-90" />
              </span>
              from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748b]">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-[#64748b] mt-1">
              <span className="text-green-500 flex items-center">
                -8% <ArrowUpRight className="h-3 w-3 ml-1 rotate-180" />
              </span>
              from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[65, 78, 90, 82, 75, 68, 60].map((height, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 bg-[#4ade80]/20 rounded-t" style={{ height: `${height * 0.6}%` }}>
                    <div className="w-full bg-[#4ade80] rounded-t" style={{ height: `${height}%` }}></div>
                  </div>
                  <div className="text-xs text-[#64748b] mt-2">Day {i + 1}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Math Quiz Preparation",
                  date: "Due in 2 days",
                  status: "in-progress",
                },
                {
                  title: "Physics Lab Report",
                  date: "Due tomorrow",
                  status: "pending",
                },
                {
                  title: "History Essay Review",
                  date: "Due in 3 days",
                  status: "in-progress",
                },
                {
                  title: "English Literature Analysis",
                  date: "Overdue by 1 day",
                  status: "overdue",
                },
              ].map((task, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
                >
                  <div>
                    <h3 className="font-medium text-sm">{task.title}</h3>
                    <div className="flex items-center text-xs text-[#64748b] mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.date}
                    </div>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}