'use client'

import { useRouter } from 'next/navigation'
import { Bell, ChevronDown, Home, LogOut, User, Code } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const router = useRouter()

  const handleLogout = () => {
    // Redirect to the login page
    window.location.href = 'http://localhost:81/api/user-service/auth/logout'
  }

  return (
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
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.push('/applications')}>
            <Code className="mr-2 h-4 w-4" />
            Applications
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
              <DropdownMenuItem className="hover:bg-purple-100" onSelect={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                User Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-purple-100" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}