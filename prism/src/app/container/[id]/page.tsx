'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

// Example log data
const generateExampleLogs = (count: number) => {
  const levels = ['INFO', 'WARN', 'ERROR']
  const messages = [
    'Application started',
    'Database connection established',
    'New user registered',
    'Failed login attempt',
    'CPU usage high',
    'Memory usage exceeded threshold',
    'API request failed',
    'Cache cleared',
    'Backup completed',
    'Security update applied'
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(Date.now() - (count - i) * 60000).toISOString(),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: messages[Math.floor(Math.random() * messages.length)]
  }))
}

// Example analysis data
const generateAnalysisData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    time: `${i * 5}m`,
    errorRate: Math.random() * 5,
    responseTime: Math.random() * 200 + 100,
    throughput: Math.floor(Math.random() * 1000 + 500)
  }))
}

export default function ContainerLogs({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [initialLogs, setInitialLogs] = useState<any[]>([])
  const [realtimeLogs, setRealtimeLogs] = useState<any[]>([])
  const [analysisData, setAnalysisData] = useState<any[]>([])

  useEffect(() => {
    // Simulate fetching initial logs
    setInitialLogs(generateExampleLogs(15))

    // Simulate real-time log updates
    const interval = setInterval(() => {
      setRealtimeLogs(prevLogs => {
        const newLog = generateExampleLogs(1)[0]
        return [newLog, ...prevLogs].slice(0, 50) // Keep the latest 50 real-time logs
      })
    }, 5000)

    // Simulate fetching analysis data
    setAnalysisData(generateAnalysisData(12)) // 1 hour of data in 5-minute intervals

    return () => clearInterval(interval)
  }, [])

  const handleBack = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
      <Button onClick={handleBack} className="mb-4 bg-white/20 text-white hover:bg-white/30">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white mb-8">
        <CardHeader>
          <CardTitle>Container Logs - Container {params.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Initial Logs</h3>
          <div className="overflow-auto max-h-[300px] mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Timestamp</TableHead>
                  <TableHead className="text-white">Level</TableHead>
                  <TableHead className="text-white">Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-white">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="text-white">{log.level}</TableCell>
                    <TableCell className="text-white">{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <h3 className="text-xl font-semibold mb-4">Real-time Logs</h3>
          <div className="overflow-auto max-h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Timestamp</TableHead>
                  <TableHead className="text-white">Level</TableHead>
                  <TableHead className="text-white">Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {realtimeLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-white">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="text-white">{log.level}</TableCell>
                    <TableCell className="text-white">{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white mb-8">
        <CardHeader>
          <CardTitle>Container Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysisData}>
                <XAxis dataKey="time" stroke="#fff" />
                <YAxis yAxisId="left" stroke="#fff" />
                <YAxis yAxisId="right" orientation="right" stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="errorRate" stroke="#FF6B6B" name="Error Rate (%)" />
                <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#4ECDC4" name="Avg Response Time (ms)" />
                <Line yAxisId="right" type="monotone" dataKey="throughput" stroke="#FFA500" name="Throughput (req/min)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold">Average Error Rate</h4>
              <p>{(analysisData.reduce((sum, data) => sum + data.errorRate, 0) / analysisData.length).toFixed(2)}%</p>
            </div>
            <div>
              <h4 className="font-semibold">Average Response Time</h4>
              <p>{(analysisData.reduce((sum, data) => sum + data.responseTime, 0) / analysisData.length).toFixed(2)} ms</p>
            </div>
            <div>
              <h4 className="font-semibold">Average Throughput</h4>
              <p>{Math.round(analysisData.reduce((sum, data) => sum + data.throughput, 0) / analysisData.length)} req/min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}