'use client'

import { useState } from 'react'
import { Bell, ChevronDown, Container, Home, LogOut, Settings, User, BarChart, PieChart, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart as RePieChart, Pie, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const lineChartData = [
  { name: '00:00', cpu: 30, memory: 65 },
  { name: '04:00', cpu: 25, memory: 60 },
  { name: '08:00', cpu: 45, memory: 70 },
  { name: '12:00', cpu: 60, memory: 80 },
  { name: '16:00', cpu: 75, memory: 85 },
]

const pieChartData = [
  { name: 'Container 1', value: 400 },
  { name: 'Container 2', value: 300 },
  { name: 'Container 3', value: 200 },
  { name: 'Container 4', value: 100 },
]

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CrystalLogo-P27fJob0FKqEjWfCryYjFbEQ0cgxZs.png" alt="" className="w-full h-full object-cover" />
      </div>
      <nav className="bg-white/10 backdrop-blur-lg p-4 relative z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CrystalLogo-P27fJob0FKqEjWfCryYjFbEQ0cgxZs.png" alt="Prism Logo" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-white">Prism</h1>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => setActiveTab('dashboard')}>
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => setActiveTab('containers')}>
              <Container className="mr-2 h-4 w-4" />
              Containers
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => setActiveTab('analysis')}>
              <BarChart className="mr-2 h-4 w-4" />
              Analysis
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/90 border-purple-400 text-purple-600 z-30">
                <DropdownMenuItem className="hover:bg-purple-100">
                  <User className="mr-2 h-4 w-4" />
                  User Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-100">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-100">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4 relative z-10">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white">
              <CardHeader>
                <CardTitle>Container Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    cpu: {
                      label: "CPU Usage",
                      color: "#FF6B6B",
                    },
                    memory: {
                      label: "Memory Usage",
                      color: "#4ECDC4",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="cpu" stroke="#FF6B6B" strokeWidth={2} />
                      <Line type="monotone" dataKey="memory" stroke="#4ECDC4" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white">
              <CardHeader>
                <CardTitle>Log Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Recent log entries:</p>
                  <ul className="text-xs space-y-1">
                    <li>[INFO] Container 1 started successfully</li>
                    <li>[WARN] High memory usage detected in Container 2</li>
                    <li>[ERROR] Container 3 crashed unexpectedly</li>
                    <li>[INFO] Automatic scaling initiated for Container 4</li>
                  </ul>
                  <p className="text-sm mt-4">AI Analysis: Potential memory leak detected in Container 2. Recommend investigation.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white">
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-red-400" />
                    <p className="text-sm">Critical: Container 3 crash</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-yellow-400" />
                    <p className="text-sm">Warning: High CPU usage in Container 1</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-green-400" />
                    <p className="text-sm">Info: Successful backup completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white">
              <CardHeader>
                <CardTitle>Resource Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {pieChartData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === 'containers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Containers Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((container) => (
                <Card key={container} className="bg-white/20 backdrop-blur-lg border-purple-300 text-white">
                  <CardHeader>
                    <CardTitle>Container {container}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Status: {container % 3 === 0 ? 'Stopped' : 'Running'}</p>
                    <p>CPU Usage: {Math.floor(Math.random() * 100)}%</p>
                    <p>Memory Usage: {Math.floor(Math.random() * 1024)}MB</p>
                    <Button className="mt-4 bg-purple-500 text-white hover:bg-purple-600">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">System Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Resource Usage Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      cpu: {
                        label: "CPU Usage",
                        color: "#FF6B6B",
                      },
                      memory: {
                        label: "Memory Usage",
                        color: "#4ECDC4",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineChartData}>
                        <XAxis dataKey="name" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="cpu" stroke="#FF6B6B" strokeWidth={2} />
                        <Line type="monotone" dataKey="memory" stroke="#4ECDC4" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Container Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    {pieChartData.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center">
                        <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span>{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Container 2 shows signs of memory leak</li>
                    <li>• CPU usage spike detected at 16:00</li>
                    
                    <li>• Container 3 crash may be related to recent update</li>
                    <li>• Recommend scaling up Container 1 resources</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Alert Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>Total Alerts: 24 (Last 24 hours)</p>
                    <ul className="list-disc list-inside">
                      <li>Critical: 3</li>
                      <li>Warning: 8</li>
                      <li>Info: 13</li>
                    </ul>
                    <p className="mt-4">Most frequent: High CPU usage (5 occurrences)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}