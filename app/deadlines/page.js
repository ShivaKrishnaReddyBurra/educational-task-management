import PageHeader from "../../components/page-header"
import ProgressBar from "../../components/progress-bar"
import StatusBadge from "../../components/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Clock } from "lucide-react"

export default function Deadlines() {
  const deadlines = [
    {
      id: 1,
      title: "Weekly Quiz",
      date: "March 15, 2023",
      description: "Complete the weekly quiz on chapters 5-7",
      progress: 75,
      status: "in-progress",
    },
    {
      id: 2,
      title: "Physics Lab Report",
      date: "March 18, 2023",
      description: "Submit the lab report on momentum",
      progress: 30,
      status: "pending",
    },
    {
      id: 3,
      title: "History Essay",
      date: "March 20, 2023",
      description: "Submit the essay on World War II",
      progress: 60,
      status: "in-progress",
    },
    {
      id: 4,
      title: "Literature Review",
      date: "March 22, 2023",
      description: "Complete the review of Shakespeare's Hamlet",
      progress: 10,
      status: "pending",
    },
  ]

  return (
    <div className="p-6">
      <PageHeader title="Deadlines" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <div className="bg-white rounded-lg p-4 text-center w-24 border border-gray-100">
            <div className="text-3xl font-bold text-[#2563eb]">2</div>
            <div className="text-xs text-[#64748b] mt-1">Today</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center w-24 border border-gray-100">
            <div className="text-3xl font-bold text-[#f59e0b]">8</div>
            <div className="text-xs text-[#64748b] mt-1">This Week</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center w-24 border border-gray-100">
            <div className="text-3xl font-bold text-[#ef4444]">3</div>
            <div className="text-xs text-[#64748b] mt-1">Overdue</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="thisWeek">This Week</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="bg-white rounded-lg p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium">{deadline.title}</h3>
                  <div className="flex items-center text-xs text-[#64748b] mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {deadline.date}
                  </div>
                </div>
                <StatusBadge status={deadline.status} />
              </div>
              <p className="text-sm text-[#64748b] mb-3">{deadline.description}</p>
              <div className="flex items-center justify-between">
                <div className="w-full max-w-md">
                  <ProgressBar progress={deadline.progress} />
                </div>
                <span className="text-xs font-medium ml-4">{deadline.progress}%</span>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="today">
          <div className="bg-[#f1f5f9] p-8 rounded-lg text-center">
            <p className="text-[#64748b]">Showing deadlines due today</p>
          </div>
        </TabsContent>

        <TabsContent value="thisWeek">
          <div className="bg-[#f1f5f9] p-8 rounded-lg text-center">
            <p className="text-[#64748b]">Showing deadlines due this week</p>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="bg-[#f1f5f9] p-8 rounded-lg text-center">
            <p className="text-[#64748b]">Showing completed deadlines</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}