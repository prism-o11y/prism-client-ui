'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, ChevronDown, Home, LogOut, Settings, User, Plus, Trash2, UserPlus, LogIn } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from 'react-toastify'

type Organization = {
  id: string
  name: string
}

export default function UserProfile() {
  const router = useRouter()
  const [email, setEmail] = useState('user@example.com') // Replace with actual user email
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: '1', name: 'Org 1' },
    { id: '2', name: 'Org 2' },
  ])
  const [newOrgName, setNewOrgName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')

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

  const handleAddOrg = () => {
    if (newOrgName) {
      const newOrg: Organization = {
        id: Date.now().toString(),
        name: newOrgName,
      }
      setOrganizations([...organizations, newOrg])
      setNewOrgName('')
      toast.success(`Organization "${newOrgName}" added successfully`)
    }
  }

  const handleDeleteOrg = (orgId: string) => {
    const orgToDelete = organizations.find(org => org.id === orgId)
    if (orgToDelete) {
      setOrganizations(organizations.filter(org => org.id !== orgId))
      toast.success(`Organization "${orgToDelete.name}" deleted successfully`)
    }
  }

  const handleAddUser = (orgName: string) => {
    if (newUserEmail) {
      toast.success(`User ${newUserEmail} added to ${orgName}`)
      setNewUserEmail('')
    }
  }

  const handleLeaveOrg = (orgId: string) => {
    const orgToLeave = organizations.find(org => org.id === orgId)
    if (orgToLeave) {
      setOrganizations(organizations.filter(org => org.id !== orgId))
      toast.success(`You have left the organization "${orgToLeave.name}"`)
    }
  }

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
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.push('/')}>
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
                {organizations.map(org => (
                  <Card key={org.id} className="bg-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
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
                              <DialogTitle>Add User to {org.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Label htmlFor="newUserEmail">User Email</Label>
                              <Input
                                id="newUserEmail"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="user@example.com"
                              />
                              <Button onClick={() => handleAddUser(org.name)}>
                                Add User
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleLeaveOrg(org.id)}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Leave Org
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteOrg(org.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Org
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
    </div>
  )
}