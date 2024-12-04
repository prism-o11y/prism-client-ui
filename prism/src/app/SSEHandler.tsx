// src/app/SSEHandler.tsx

'use client'

import { useEffect, useRef } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function SSEHandler() {
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    let eventSource: EventSource

    const initializeSSE = async () => {
      try {
        // Fetch user data from the API
        const response = await fetch(
          process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:81/api/user-service/user/get-user-by-user-id',
          {
            credentials: 'include',
          }
        )
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userData = await response.json()

        // Extract user_id from the response
        const clientID = userData.data.user_id
        const connectionID = userData.data.user_id // Using user_id for both

        const nodes = [
          process.env.NEXT_PUBLIC_ALERT_NOTI_SERVICE_URL || 'http://localhost/api/alert-noti-service',
        ]
        let currentNodeIndex = 0

        const connect = () => {
          const currentNode = nodes[currentNodeIndex]
          console.log(`Attempting to connect to ${currentNode}...`)

          eventSource = new EventSource(
            `${currentNode}/events?client_id=${clientID}&connection_id=${connectionID}`
          )
          eventSourceRef.current = eventSource

          eventSource.onopen = function () {
            console.log(`Connected to SSE server at ${currentNode}.`)
          }

          eventSource.onmessage = function (event) {
            console.log(`Received event: ${event.data}`)
            // Parse the event data
            try {
              const data = JSON.parse(event.data)
              const severity = data.severity || 'info'
              const message = data.message || 'New event received'
              toast(message, { type: severity })
            } catch (e) {
              console.error('Failed to parse event data', e)
              toast(`Received event: ${event.data}`, { type: 'info' })
            }
          }

          // Custom event handler for "SSE" events
          eventSource.addEventListener('SSE', function (event) {
            console.log('Alert received:', event.data)
            // Parse the event data
            try {
              const data = JSON.parse(event.data)
              const severity = data.severity || 'info'
              const message = data.message || 'Alert received'
              toast(message, { type: severity })
            } catch (e) {
              console.error('Failed to parse event data', e)
              toast(`Alert received: ${event.data}`, { type: 'info' })
            }
          })

          eventSource.onerror = function (err) {
            console.error('EventSource failed:', err)
            console.log('Connection error occurred. Retrying...')
            eventSource.close()
            setTimeout(connect, 1000)
          }
        }

        connect()
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    initializeSSE()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        console.log('SSE connection closed.')
      }
    }
  }, [])

  return <ToastContainer />
}
