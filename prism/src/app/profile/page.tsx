'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, UserPlus, LogIn } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '@/components/Navbar'

type Organization = {
  org_id: string
  name: string
}

export default function UserProfile() {
  const [email, setEmail] = useState('') // Replace with actual user email
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [newOrgName, setNewOrgName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch('http://localhost:81/api/user-service/user/get-user-by-id',
          {
            credentials: 'include',
          }
        )
        if (response.ok) {
          const data = await response.json()
          setEmail(data.data.email)
        } else {
          window.location.href = 'http://localhost:81/api/user-service/auth/login'
        }
      } catch (error) {
        console.error('Error fetching user email:', error)
        window.location.href = 'http://localhost:81/api/user-service/auth/login'
      }
    }

    const fetchOrganization = async () => {
      try {
        const response = await fetch('http://localhost:81/api/user-service/org/get-org-by-user-id',
          {
            credentials: 'include',
          }
        )
        if (response.ok) {
          const data = await response.json()
          setOrganization({
            org_id: data.data.org_id,
            name: data.data.name,
          })
        } else if (response.status === 404) {
          console.log('No organization found')
        } else {
          window.location.href = 'http://localhost:81/api/user-service/auth/login'
        }
      } catch (error) {
        console.error('Error fetching organization:', error)
        window.location.href = 'http://localhost:81/api/user-service/auth/login'
      }
    }

    fetchUserEmail()
    fetchOrganization()
  }, [])

  const handleAddOrg = async() => {
    if (newOrgName) {
      try {
        const response = await fetch('http://localhost:81/api/user-service/org/create-org', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ name: newOrgName }),
        });
  
        if (response.status === 401) {
          window.location.href = 'http://localhost:81/api/user-service/auth/login';
          return;
        }
  
        if (response.ok) {
          toast.info(`Organization "${newOrgName}" is being created. Please wait...`);
          setNewOrgName(''); // Clear the input field
  
          // Simulate a wait for Kafka to process the org creation
          setTimeout(async () => {
            const fetchOrgResponse = await fetch('http://localhost:81/api/user-service/org/get-org-by-user-id',
              {
                credentials: 'include',
              }
            );
            if (fetchOrgResponse.ok) {
              const data = await fetchOrgResponse.json();
              setOrganization({
                org_id: data.data.org_id,
                name: data.data.name,
              });
            }
          }, 3000); // Wait for 3 seconds
        }
      } catch (error) {
        console.error('Error adding organization:', error);
      }
    } else {
      toast.error('Organization name cannot be empty.');
    }
  
  }

  const handleDeleteOrg = async() => {
    try {
      const response = await fetch('http://localhost:81/api/user-service/org/delete-org', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        window.location.href = 'http://localhost:81/api/user-service/auth/login';
        return;
      }

      if (response.ok) {
        toast.info(`Organization "${organization?.name}" is being deleted. Please wait...`);

        // Simulate a wait for Kafka to process the org deletion
        setTimeout(async () => {
          const fetchOrgResponse = await fetch('http://localhost:81/api/user-service/org/get-org-by-user-id', {
            credentials: 'include',
          });

          if (fetchOrgResponse.ok) {
            const data = await fetchOrgResponse.json();
            if (data.data) {
              setOrganization({
                org_id: data.data.org_id,
                name: data.data.name,
              });
              toast.error(`Failed to delete the organization. It still exists.`);
            } else {
              setOrganization(null);
            }
          } else {
            setOrganization(null);
          }
        }, 3000); // Wait for 3 seconds
      } else {
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  }

  const handleAddUser = async () => {
    if (newUserEmail && organization) {
      try {
        const response = await fetch('http://localhost:81/api/user-service/org/add-user-to-org', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include user's cookie
          body: JSON.stringify({
            email: newUserEmail,         // Email of the user to be added
          }),
        });
  
        if (response.status === 401) {
          window.location.href = 'http://localhost:81/api/user-service/auth/login';
          return;
        }
  
        if (response.ok) {
          setNewUserEmail(''); // Clear the input field
  
          // Simulate Kafka delay (3 seconds) to confirm the user addition
          setTimeout(async () => {
            try {
              const fetchOrgResponse = await fetch('http://localhost:81/api/user-service/org/get-org-by-user-id', {
                credentials: 'include',
              });
  
              if (fetchOrgResponse.ok) {
                const data = await fetchOrgResponse.json();
                setOrganization({
                  org_id: data.data.org_id,
                  name: data.data.name,
                });
              } else {

              }
            } catch (error) {
              console.error('Error fetching organization after Kafka delay:', error);
            }
          }, 3000); // Wait for 3 seconds (Kafka delay)
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
    } else {
      toast.error('User email cannot be empty.');
    }
  
  }

  const handleLeaveOrg = async() => {
    if (organization) {
      try {
        const response = await fetch('http://localhost:81/api/user-service/org/remove-user-from-org', {
          method: 'DELETE',
          credentials: 'include', // Include user's cookie for authentication
        });
  
        if (response.status === 401) {
          window.location.href = 'http://localhost:81/api/user-service/auth/login';
          return;
        }
  
        if (response.ok) {
          toast.info(`You are leaving the organization "${organization.name}". Please wait...`);
  
          // Simulate Kafka delay (3 seconds) to confirm the user removal
          setTimeout(async () => {
            try {
              const fetchOrgResponse = await fetch('http://localhost:81/api/user-service/org/get-org-by-user-id', {
                credentials: 'include',
              });
  
              if (fetchOrgResponse.ok) {
                const data = await fetchOrgResponse.json();
                if (data.data) {
                  setOrganization({
                    org_id: data.data.org_id,
                    name: data.data.name,
                  });
                  toast.error(`Failed to leave the organization. It still exists.`);
                } else {
                  setOrganization(null);
                }
              } else {
                setOrganization(null);
              }
            } catch (error) {
              console.error('Error verifying organization after Kafka delay:', error);
            }
          }, 3000); // Wait for 3 seconds (Kafka delay)
        } else {
          const errorData = await response.json();
        }
      } catch (error) {
        console.error('Error leaving organization:', error);
      }
    } else {
      toast.error('No organization found to leave.');
    }
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
            <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} readOnly className="bg-white/10 text-white" />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Organizations</h3>
              <div className="space-y-4">
                {organization ? (
                  <Card key={organization.org_id} className="bg-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg">{organization.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2 space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <UserPlus className="mr-2 h-4 w-4" />
                              Add User
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white text-black">
                            <DialogHeader>
                              <DialogTitle>Add User to {organization.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Label htmlFor="newUserEmail">User Email</Label>
                              <Input
                                id="newUserEmail"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="user@example.com"
                              />
                              <Button onClick={() => handleAddUser()}>
                                Add User
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleLeaveOrg()}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Leave Org
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteOrg()}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Org
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <p>No organizations available</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Add New Organization</h3>
              <div className="flex space-x-2">
                <Input
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="New Organization Name"
                  className="bg-white/10 text-white"
                />
                <Button onClick={handleAddOrg}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Org
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  )
}
