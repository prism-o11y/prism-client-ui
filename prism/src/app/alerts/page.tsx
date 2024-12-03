'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '@/components/Navbar'

type Alert = {
  id: string
  timestamp: string
  severity: 'info' | 'warning' | 'error'
  message: string
  containerName: string
}

const severityColors = {
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500'
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    // Simulating fetching initial alerts
    const initialAlerts: Alert[] = [
      { id: '1', timestamp: new Date().toISOString(), severity: 'info', message: 'System update completed', containerName: 'Web Server' },
      { id: '2', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), severity: 'warning', message: 'High CPU usage detected', containerName: 'Database' },
      { id: '3', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), severity: 'error', message: 'Connection lost', containerName: 'Cache Server' },
    ]
    setAlerts(initialAlerts)

    // Simulating real-time alerts
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        severity: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)] as 'info' | 'warning' | 'error',
        message: `New alert: ${Math.random().toString(36).substring(7)}`,
        containerName: ['Web Server', 'Database', 'Cache Server'][Math.floor(Math.random() * 3)]
      }
      setAlerts(prevAlerts => [newAlert, ...prevAlerts].slice(0, 50)) // Keep the latest 50 alerts
    }, 10000) // New alert every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CrystalLogo-P27fJob0FKqEjWfCryYjFbEQ0cgxZs.png" alt="" className="w-full h-full object-cover" />
      </div>
      <Navbar />
      <main className="container mx-auto mt-8 px-4 relative z-10">
        <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg flex justify-between items-center ${severityColors[alert.severity]}`}>
                  <div>
                    <p className="font-semibold">{alert.containerName}</p>
                    <p>{alert.message}</p>
                    <p className="text-sm opacity-75">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDismissAlert(alert.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  )
}