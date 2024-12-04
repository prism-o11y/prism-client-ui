// src/app/SSEHandler.tsx

'use client'

import { useEffect, useRef } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function SSEHandler() {
    const userEventSourceRef = useRef<EventSource | null>(null)
    const orgEventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const initializeSSE = async () => {
      try {
        // Fetch user data from the API
        const userResponse = await fetch('http://localhost:81/api/user-service/user/get-user-by-user-id', {
          credentials: 'include',
        });
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userData = await userResponse.json()
        // Extract user_id from the response
        const clientID = userData.data.user_id
        const userConnectionID = userData.data.user_id // Using user_id for user connection

        // Fetch organization data from the API
        const orgResponse = await fetch('http://localhost:81/api/user-service/org/get-org-by-user-id', {
          credentials: 'include',
        });
        if (!orgResponse.ok) {
          throw new Error('Failed to fetch organization data')
        }
        const orgData = await orgResponse.json()
        // Extract org_id from the response
        const orgConnectionID = orgData.data.org_id

        const nodes = [
          'http://localhost/api/alert-noti-service',
        ];
        let currentNodeIndex = 0;

        // Function to connect to SSE for user events
        const connectUserEvents = () => {
          const currentNode = nodes[currentNodeIndex];
          console.log(`Attempting to connect to ${currentNode} for user events...`);

          const userEventSource = new EventSource(`${currentNode}/events?client_id=${clientID}&connection_id=${userConnectionID}`);
          userEventSourceRef.current = userEventSource;

          userEventSource.onopen = function() {
            console.log(`Connected to SSE server at ${currentNode} for user events.`);
          };

          userEventSource.onmessage = function(event) {
            console.log(`Received user event: ${event.data}`);
            // Handle user event
            try {
              const data = JSON.parse(event.data);
              const severity = data.severity || 'info';
              const message = data.message || 'New user event received';
              toast(`User Event: ${message}`, { type: severity });
            } catch (e) {
              console.error('Failed to parse user event data', e);
              toast(`Received user event: ${event.data}`, { type: 'info' });
            }
          };

          userEventSource.onerror = function(err) {
            console.error('User EventSource failed:', err);
            console.log('User connection error occurred. Retrying...');
            userEventSource.close();
            setTimeout(connectUserEvents, 1000);
          };
        };

        // Function to connect to SSE for organization events
        const connectOrgEvents = () => {
          const currentNode = nodes[currentNodeIndex];
          console.log(`Attempting to connect to ${currentNode} for organization events...`);

          const orgEventSource = new EventSource(`${currentNode}/events?client_id=${clientID}&connection_id=${orgConnectionID}`);
          orgEventSourceRef.current = orgEventSource;

          orgEventSource.onopen = function() {
            console.log(`Connected to SSE server at ${currentNode} for organization events.`);
          };

          orgEventSource.onmessage = function(event) {
            console.log(`Received organization event: ${event.data}`);
            // Handle organization event
            try {
              const data = JSON.parse(event.data);
              const severity = data.severity || 'info';
              const message = data.message || 'New organization event received';
              toast(`Organization Event: ${message}`, { type: severity });
            } catch (e) {
              console.error('Failed to parse organization event data', e);
              toast(`Received organization event: ${event.data}`, { type: 'info' });
            }
          };

          orgEventSource.onerror = function(err) {
            console.error('Organization EventSource failed:', err);
            console.log('Organization connection error occurred. Retrying...');
            orgEventSource.close();
            setTimeout(connectOrgEvents, 1000);
          };
        };

        // Connect to both user and organization events
        connectUserEvents();
        connectOrgEvents();

      } catch (error) {
        console.error('Error initializing SSE:', error);
      }
    };

    initializeSSE();

    return () => {
      if (userEventSourceRef.current) {
        userEventSourceRef.current.close();
        console.log('User SSE connection closed.');
      }
      if (orgEventSourceRef.current) {
        orgEventSourceRef.current.close();
        console.log('Organization SSE connection closed.');
      }
    };
  }, []);

//   useEffect(() => {
//     let eventSource: EventSource

//     const initializeSSE = async () => {
//       try {
//         // Fetch user data from the API
//         const response = await fetch(
//           process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:81/api/user-service/user/get-user-by-user-id',
//           {
//             credentials: 'include',
//           }
//         )
//         if (!response.ok) {
//           throw new Error('Failed to fetch user data')
//         }
//         const userData = await response.json()

//         // Extract user_id from the response
//         const clientID = userData.data.user_id
//         const connectionID = userData.data.user_id // Using user_id for both

//         const nodes = [
//           process.env.NEXT_PUBLIC_ALERT_NOTI_SERVICE_URL || 'http://localhost/api/alert-noti-service',
//         ]
//         let currentNodeIndex = 0

//         const connect = () => {
//           const currentNode = nodes[currentNodeIndex]
//           console.log(`Attempting to connect to ${currentNode}...`)

//           eventSource = new EventSource(
//             `${currentNode}/events?client_id=${clientID}&connection_id=${connectionID}`
//           )
//           eventSourceRef.current = eventSource

//           eventSource.onopen = function () {
//             console.log(`Connected to SSE server at ${currentNode}.`)
//           }

//           eventSource.onmessage = function (event) {
//             console.log(`Received event: ${event.data}`)
//             // Parse the event data
//             try {
//               const data = JSON.parse(event.data)
//               const severity = data.severity || 'info'
//               const message = data.message || 'New event received'
//               toast(message, { type: severity })
//             } catch (e) {
//               console.error('Failed to parse event data', e)
//               toast(`Received event: ${event.data}`, { type: 'info' })
//             }
//           }

//           // Custom event handler for "SSE" events
//           eventSource.addEventListener('SSE', function (event) {
//             console.log('Alert received:', event.data)
//             // Parse the event data
//             try {
//               const data = JSON.parse(event.data)
//               const severity = data.severity || 'info'
//               const message = data.message || 'Alert received'
//               toast(message, { type: severity })
//             } catch (e) {
//               console.error('Failed to parse event data', e)
//               toast(`Alert received: ${event.data}`, { type: 'info' })
//             }
//           })

//           eventSource.onerror = function (err) {
//             console.error('EventSource failed:', err)
//             console.log('Connection error occurred. Retrying...')
//             eventSource.close()
//             setTimeout(connect, 1000)
//           }
//         }

//         connect()
//       } catch (error) {
//         console.error('Error fetching user data:', error)
//       }
//     }

//     initializeSSE()

//     return () => {
//       if (eventSourceRef.current) {
//         eventSourceRef.current.close()
//         console.log('SSE connection closed.')
//       }
//     }
//   }, [])

  return <ToastContainer />
}
