import PageHeader from "../../components/page-header"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Calendar() {
  // Generate calendar days
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"]

  // Events
  const events = [
    {
      id: 1,
      title: "Math Quiz",
      date: "Mar 15, 2023",
      time: "10:00 AM",
    },
    {
      id: 2,
      title: "Science Lab",
      date: "Mar 17, 2023",
      time: "2:30 PM",
    },
    {
      id: 3,
      title: "Parent-Teacher Meeting",
      date: "Mar 20, 2023",
      time: "4:00 PM",
    },
    {
      id: 4,
      title: "Field Trip",
      date: "Mar 25, 2023",
      time: "9:00 AM",
    },
  ]

  return (
    <div className="p-6">
      <PageHeader title="Calendar" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekdays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-[#64748b]">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before the 1st */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 rounded-md"></div>
                ))}

                {days.map((day) => {
                  const isToday = day === 15
                  const hasEvent = [15, 17, 20, 25].includes(day)

                  return (
                    <div
                      key={day}
                      className={`h-10 flex items-center justify-center rounded-md text-sm ${
                        isToday
                          ? "bg-[#1f5aad] text-white"
                          : hasEvent
                            ? "bg-[#dbeafe] text-[#1f5aad]"
                            : "hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="text-sm text-[#64748b] mt-1">
                      {event.date} at {event.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

