'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TooltipProvider } from "@/components/ui/tooltip"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '@/components/Navbar'

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
  // const eventSourceRef = useRef<EventSource | null>(null)

  // useEffect(() => {
  //   let eventSource: EventSource

  //   const initializeSSE = async () => {
  //     try {
  //       // Fetch user data from the API
  //       const response = await fetch('http://localhost:81/api/user-service/user/get-user-by-user-id',
  //         {
  //           credentials: 'include',
  //         }
  //       )
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch user data')
  //       }
  //       const userData = await response.json()

  //       // Extract user_id from the response
  //       const clientID = userData.data.user_id
  //       const connectionID = userData.data.user_id // Using user_id for both

  //       const nodes = [
  //         'http://localhost/api/alert-noti-service',
  //       ];
  //       let currentNodeIndex = 0;

  //       const connect = () => {
  //         const currentNode = nodes[currentNodeIndex];
  //         console.log(`Attempting to connect to ${currentNode}...`);

  //         eventSource = new EventSource(`${currentNode}/events?client_id=${clientID}&connection_id=${connectionID}`);
  //         eventSourceRef.current = eventSource;

  //         eventSource.onopen = function() {
  //           console.log(`Connected to SSE server at ${currentNode}.`);
  //         };

  //         eventSource.onmessage = function(event) {
  //           console.log(`Received event: ${event.data}`);
  //           // Parse the event data
  //           try {
  //             const data = JSON.parse(event.data);
  //             const severity = data.severity || 'info';
  //             const message = data.message || 'New event received';
  //             toast(message, { type: severity });
  //           } catch (e) {
  //             console.error('Failed to parse event data', e);
  //             toast(`Received event: ${event.data}`, { type: 'info' });
  //           }
  //         };

  //         // Custom event handler for "SSE" events
  //         eventSource.addEventListener('SSE', function(event) {
  //           console.log('Alert received:', event.data);
  //           // Parse the event data
  //           try {
  //             const data = JSON.parse(event.data);
  //             const severity = data.severity || 'info';
  //             const message = data.message || 'Alert received';
  //             toast(message, { type: severity });
  //           } catch (e) {
  //             console.error('Failed to parse event data', e);
  //             toast(`Alert received: ${event.data}`, { type: 'info' });
  //           }
  //         });

  //         eventSource.onerror = function(err) {
  //           console.error('EventSource failed:', err);
  //           console.log('Connection error occurred. Retrying...');
  //           eventSource.close();
  //           setTimeout(connect, 1000);
  //         };
  //       }

  //       connect();

  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   };

  //   initializeSSE();

  //   return () => {
  //     if (eventSourceRef.current) {
  //       eventSourceRef.current.close();
  //       console.log('SSE connection closed.');
  //     }
  //   };
  // }, []);

  const handleContainerClick = (container: typeof exampleContainers[0]) => {
    router.push(`/container/${container.id}`)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CrystalLogo-P27fJob0FKqEjWfCryYjFbEQ0cgxZs.png" alt="" className="w-full h-full object-cover" />
        </div>
        <Navbar />
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

