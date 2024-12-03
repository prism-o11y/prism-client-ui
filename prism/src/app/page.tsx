'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, ChevronDown, Container, Home, LogOut, Settings, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TooltipProvider } from "@/components/ui/tooltip"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Example data
const exampleContainers = [
  {
    id: '1',
    app_name: 'Web Server',
    app_url: 'http://webserver.example.com',
    status: 'Running',
    cpu_usage: 45,
    memory_usage: 512,
    metrics: [
      { timestamp: '00:00', cpu: 40, memory: 500 },
      { timestamp: '00:05', cpu: 45, memory: 512 },
      { timestamp: '00:10', cpu: 42, memory: 508 },
    ]
  },
  {
    id: '2',
    app_name: 'Database',
    app_url: 'http://db.example.com',
    status: 'Running',
    cpu_usage: 60,
    memory_usage: 1024,
    metrics: [
      { timestamp: '00:00', cpu: 55, memory: 1000 },
      { timestamp: '00:05', cpu: 60, memory: 1024 },
      { timestamp: '00:10', cpu: 58, memory: 1016 },
    ]
  },
  {
    id: '3',
    app_name: 'Cache Server',
    app_url: 'http://cache.example.com',
    status: 'Running',
    cpu_usage: 30,
    memory_usage: 256,
    metrics: [
      { timestamp: '00:00', cpu: 28, memory: 250 },
      { timestamp: '00:05', cpu: 30, memory: 256 },
      { timestamp: '00:10', cpu: 29, memory: 254 },
    ]
  }
]

export default function Dashboard() {
  const router = useRouter()
  const [containers, setContainers] = useState(exampleContainers)

  useEffect(() => {
    // Simulating SSE for real-time notifications
    const interval = setInterval(() => {
      const severities = ['info', 'warning', 'error'] as const
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)]
      toast(`New ${randomSeverity} alert for ${exampleContainers[Math.floor(Math.random() * exampleContainers.length)].app_name}`, { type: randomSeverity })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleContainerClick = (container: typeof exampleContainers[0]) => {
    router.push(`/container/${container.id}`)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' })
      if (response.ok) {
        window.location.href = 'http://localhost:81/api/user-service/auth/login'
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <TooltipProvider>
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
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.push('/alerts')}>
                <Bell className="mr-2 h-4 w-4" />
                Alerts
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
                  <DropdownMenuItem className="hover:bg-purple-100" onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>

        <main className="container mx-auto mt-8 px-4 relative z-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Containers Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {containers.map((container) => (
                <Card key={container.id} className="bg-white/20 backdrop-blur-lg border-purple-300 text-white cursor-pointer" onClick={() => handleContainerClick(container)}>
                  <CardHeader>
                    <CardTitle>{container.app_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Status: {container.status}</p>
                    <p>CPU Usage: {container.cpu_usage}%</p>
                    <p>Memory Usage: {container.memory_usage}MB</p>
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
                      className="h-[100px] mt-4"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={container.metrics}>
                          <XAxis dataKey="timestamp" hide />
                          <YAxis hide />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="cpu" stroke="#FF6B6B" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="memory" stroke="#4ECDC4" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </TooltipProvider>
  )
}