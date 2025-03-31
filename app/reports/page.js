import PageHeader from "../../components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export default function Reports() {
  return (
    <div className="p-6">
      <PageHeader title="Reports" />

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[65, 78, 90, 82, 75, 68, 60].map((height, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 bg-[#4ade80]/20 rounded-t" style={{ height: `${height * 0.6}%` }}>
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
            <CardTitle>Student Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 800 300">
                <path
                  d="M50,250 L100,230 L150,180 L200,120 L250,100 L300,70 L350,90 L400,60 L450,90 L500,110 L550,140 L600,130 L650,150 L700,170 L750,190"
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
                {[
                  { x: 100, y: 230 },
                  { x: 150, y: 180 },
                  { x: 200, y: 120 },
                  { x: 250, y: 100 },
                  { x: 300, y: 70 },
                  { x: 350, y: 90 },
                  { x: 400, y: 60 },
                  { x: 450, y: 90 },
                  { x: 500, y: 110 },
                  { x: 550, y: 140 },
                  { x: 600, y: 130 },
                  { x: 650, y: 150 },
                  { x: 700, y: 170 },
                  { x: 750, y: 190 },
                ].map((point, i) => (
                  <circle key={i} cx={point.x} cy={point.y} r="4" fill="#4ade80" />
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

