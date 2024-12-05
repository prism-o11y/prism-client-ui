'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TooltipProvider } from "@/components/ui/tooltip"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '@/components/Navbar'
import Image from 'next/image' // Use Next.js Image component for better performance

// Define interfaces for your data structures
interface Metric {
  timestamp: string
  cpu: number
  memory: number
}

interface Container {
  id: string
  app_name: string
  app_url: string
  status: string
  cpu_usage: number
  memory_usage: number
  metrics: Metric[]
}

interface AppData {
  app_id: string
  app_name: string
  app_url: string
}

interface ApiResponse {
  status: string
  data: AppData[]
}

export default function Dashboard() {
  const router = useRouter()
  
  // Use type annotations for state variables
  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContainers = async (): Promise<void> => {
      try {
        const response = await fetch('http://localhost:81/api/user-service/apps/get-app-by-user-id', {
          credentials: 'include',
        })

        if (response.ok) {
          const data: ApiResponse = await response.json()
          if (data.status === 'Success') {
            // Transform API data and randomize missing fields
            const transformedData: Container[] = data.data.map((app: AppData) => ({
              id: app.app_id,
              app_name: app.app_name,
              app_url: app.app_url,
              status: Math.random() > 0.5 ? 'Running' : 'Stopped',
              cpu_usage: Math.floor(Math.random() * 101),
              memory_usage: Math.floor(Math.random() * 1025),
              metrics: Array.from({ length: 10 }, (_, i) => ({
                timestamp: `00:${(i * 5).toString().padStart(2, '0')}`,
                cpu: Math.floor(Math.random() * 101),
                memory: Math.floor(Math.random() * 1025),
              })),
            }))
            setContainers(transformedData)
          } else {
            console.log('No apps found')
            setContainers([])
          }
        } else if (response.status === 404) {
          console.log('No apps found for the user')
          setContainers([])
        } else {
          router.push('http://localhost:81/api/user-service/auth/login') // Use router for navigation
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching apps:', error.message)
          setError(error.message)
        } else {
          console.error('Unknown error fetching apps')
          setError('Unknown error fetching apps')
        }
        router.push('http://localhost:81/api/user-service/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchContainers()
  }, [router])

  const handleContainerClick = (container: Container) => {
    router.push(`/container/${container.app_url}`)
  }

  if (loading) {
    return <p className="text-white">Loading...</p>
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Use Next.js Image component for better performance */}
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CrystalLogo-P27fJob0FKqEjWfCryYjFbEQ0cgxZs.png"
            alt=""
            layout="fill"
            objectFit="cover"
          />
        </div>
        <Navbar />
        <main className="container mx-auto mt-8 px-4 relative z-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Containers Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {containers.map((container: Container) => (
                <Card
                  key={container.app_name}
                  className="bg-white/20 backdrop-blur-lg border-purple-300 text-white cursor-pointer"
                  onClick={() => handleContainerClick(container)}
                >
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </TooltipProvider>
  )
}
