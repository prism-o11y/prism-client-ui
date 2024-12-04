'use client'

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';
import App from 'next/app';

type Application = {
  app_url: string;
  app_name: string;
};

export default function UserApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');
  const [editApp, setEditApp] = useState<Application | null>(null);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:81/api/user-service/apps/get-app-by-user-id', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        const apps = data.data.map((app: any) => ({
          app_url: app.app_url,
          app_name: app.app_name,
        }));
        setApplications(apps);
      } else if (response.status === 401) {
        window.location.href = 'http://localhost:81/api/user-service/auth/login';
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAddApplication = async () => {
    if (!newAppName || !newAppUrl) {
      toast.error('Both application name and URL are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:81/api/user-service/apps/add-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ app_name: newAppName, app_url: newAppUrl }),
      });

      if (response.status === 401) {
        window.location.href = 'http://localhost:81/api/user-service/auth/login';
        return;
      }

      if (response.ok) {
        toast.info(`Application "${newAppName}" is being added. Please wait...`);
        setNewAppName('');
        setNewAppUrl('');

        // Simulate a wait for Kafka to process the app creation
        setTimeout(async () => {
          await fetchApplications();
        }, 3000); // Wait for 3 seconds
      }
    } catch (error) {
      console.error('Error adding application:', error);
    }
  };

  const handleEditApplication = async () => {
    if (!editApp) return;

    try {
      const response = await fetch('http://localhost:81/api/user-service/apps/update-app', {
        method: 'POST', // Use POST since the backend likely expects this for Kafka processing
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ app_name: editApp.app_name, app_url: editApp.app_url }),
      });
  
      if (response.status === 401) {
        window.location.href = 'http://localhost:81/api/user-service/auth/login';
        return;
      }
  
      if (response.ok) {
        setEditApp(null); // Reset the edit state
  
        setTimeout(async () => {
          try {
            const fetchAppsResponse = await fetch('http://localhost:81/api/user-service/apps/get-app-by-user-id', {
              credentials: 'include',
            });
            if (fetchAppsResponse.ok) {
              const data = await fetchAppsResponse.json();
              const apps = data.data.map((app: any) => ({
                app_url: app.app_url,
                app_name: app.app_name,
              }));
              setApplications(apps);
            } 
          } catch (fetchError) {
            console.error('Error fetching applications:', fetchError);
          }
        }, 5000); // Wait for 3 seconds to allow Kafka processing
      } 
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleDeleteApplication = async (app: Application) => {
    try {
      const response = await fetch('http://localhost:81/api/user-service/apps/delete-app', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ app_url: app.app_url, app_name: app.app_name }),
      });

      if (response.status === 401) {
        window.location.href = 'http://localhost:81/api/user-service/auth/login';
        return;
      }

      if (response.ok) {
        toast.info(`Application "${app.app_name}" is being deleted. Please wait...`);

        // Simulate a wait for Kafka to process the app deletion
        setTimeout(async () => {
          const fetchAppsResponse = await fetch('http://localhost:81/api/user-service/apps/get-app-by-user-id', {
            credentials: 'include',
          });

          if (fetchAppsResponse.ok) {
            const data = await fetchAppsResponse.json();
            const apps = data.data.map((app: any) => ({
              app_url: app.app_url,
              app_name: app.app_name,
            }));
            setApplications(apps);

            if (apps.some((a: Application) => a.app_url === app.app_url)) {
              toast.error(`Failed to delete the application. It still exists.`);
            } 
          } else {
            setApplications([]);
          }
        }, 3000); // Wait for 3 seconds
      } 
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CrystalLogo-P27fJob0FKqEjWfCryYjFbEQ0cgxZs.png" alt="" className="w-full h-full object-cover" />
      </div>
      <Navbar />
      <main className="container mx-auto mt-8 px-4 relative z-10">
        <Card className="bg-white/20 backdrop-blur-lg border-purple-300 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Add New Application</h3>
                  <div className="flex space-x-2">
                    <Input
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      placeholder="Application Name"
                      className="bg-white/10 text-white"
                    />
                    <Input
                      value={newAppUrl}
                      onChange={(e) => setNewAppUrl(e.target.value)}
                      placeholder="Application URL"
                      className="bg-white/10 text-white"
                    />
                    <Button onClick={handleAddApplication}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add App
                    </Button>
                  </div>
                </div>
                {applications.map(app => (
                  <Card key={app.app_url} className="bg-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg">{app.app_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditApp(app)}>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white text-black">
                            <DialogHeader>
                              <DialogTitle>Edit Application</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Label htmlFor="editAppName">Application Name</Label>
                              <Input
                                id="editAppName"
                                value={editApp?.app_name || ''}
                                onChange={(e) => setEditApp({ ...editApp!, app_name: e.target.value })}
                              />
                              <Label htmlFor="editAppUrl">Application URL</Label>
                              <Input
                                id="editAppUrl"
                                value={editApp?.app_url || ''}
                                readOnly
                              />
                              <Button onClick={handleEditApplication}>Save Changes</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteApplication(app)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
