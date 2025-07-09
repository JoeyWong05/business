import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Shield, 
  Bell, 
  Mail, 
  Key, 
  EyeOff, 
  LogOut, 
  UserCog, 
  Users, 
  Smartphone, 
  ShieldCheck, 
  Globe,
  Check,
  LockKeyhole,
  ExternalLink
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function AccountPage() {
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    jobTitle: 'Marketing Director',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    profileImage: null, // URL would go here
    initials: 'AJ',
    role: 'Administrator',
    entityAccess: ['Digital Merch Pros', 'Mystery Hype', 'Lone Star Custom Clothing'],
    twoFactorEnabled: true,
    newsletterSubscribed: true,
    productUpdates: true,
    weeklyDigest: false,
    securityAlerts: true,
    lastLogin: new Date(2025, 2, 23, 9, 15),
    deviceHistory: [
      { 
        device: 'MacBook Pro', 
        browser: 'Chrome', 
        ip: '192.168.1.1', 
        location: 'New York, USA', 
        time: new Date(2025, 2, 23, 9, 15),
        current: true
      },
      { 
        device: 'iPhone 14', 
        browser: 'Safari', 
        ip: '192.168.1.2', 
        location: 'New York, USA', 
        time: new Date(2025, 2, 22, 18, 30),
        current: false
      },
      { 
        device: 'Windows PC', 
        browser: 'Edge', 
        ip: '192.168.1.3', 
        location: 'Boston, USA', 
        time: new Date(2025, 2, 19, 14, 45),
        current: false
      }
    ]
  });
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  return (
    <MainLayout>
      <div className="mx-auto p-4 sm:p-6 max-w-5xl">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Account Settings</h2>
              <p className="text-muted-foreground mt-1">Manage your profile, notification preferences, and security settings</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/settings">
                  Back to Settings
                </Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/billing">
                  Billing & Subscription
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left sidebar for larger screens */}
            <Card className="md:col-span-4 lg:col-span-3">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={userData.profileImage || ''} alt={userData.name} />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">{userData.initials}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{userData.name}</h3>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                  <div className="mt-2">
                    <Badge className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      {userData.role}
                    </Badge>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1 mt-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">BUSINESS ACCESS</h4>
                  <div className="space-y-2">
                    {userData.entityAccess.map((entity, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="text-sm">{entity}</div>
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    <UserCog className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="mt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                        <LogOut className="h-4 w-4 mr-2" />
                        Log Out
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will need to login again to access your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Log Out</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
            
            {/* Main content area */}
            <div className="md:col-span-8 lg:col-span-9 space-y-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-3 md:flex md:w-fit">
                  <TabsTrigger value="profile" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-1">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-6 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your basic profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={userData.name} 
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={userData.email} 
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input 
                            id="jobTitle" 
                            value={userData.jobTitle} 
                            onChange={(e) => setUserData({...userData, jobTitle: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            value={userData.phone} 
                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select 
                          value={userData.timezone} 
                          onValueChange={(value) => setUserData({...userData, timezone: value})}
                        >
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                            <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={userData.profileImage || ''} alt={userData.name} />
                            <AvatarFallback className="text-lg bg-primary text-primary-foreground">{userData.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline">Upload New Image</Button>
                            <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Account Role</CardTitle>
                          <CardDescription>Manage your account permissions</CardDescription>
                        </div>
                        <Badge variant="outline" className="py-1 px-2 bg-primary/10 text-primary border-primary/20">
                          {userData.role}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Role Management</p>
                            <p className="text-xs text-muted-foreground">Your role can only be changed by an administrator</p>
                          </div>
                        </div>
                        <Button variant="outline" disabled>
                          <EyeOff className="h-4 w-4 mr-2" />
                          <span>Restricted</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-6 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Update your password regularly to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" placeholder="••••••••" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" placeholder="••••••••" />
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-md p-3 text-sm">
                        <p className="font-medium mb-1">Password requirements:</p>
                        <ul className="space-y-1 ml-4 list-disc text-muted-foreground">
                          <li>At least 10 characters</li>
                          <li>At least one uppercase letter</li>
                          <li>At least one number</li>
                          <li>At least one special character</li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Update Password</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Two-Factor Authentication</CardTitle>
                          <CardDescription>Add an extra layer of security to your account</CardDescription>
                        </div>
                        <Badge variant={userData.twoFactorEnabled ? "default" : "outline"} className={cn(
                          userData.twoFactorEnabled && "bg-green-600"
                        )}>
                          {userData.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LockKeyhole className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Two-Factor Authentication</p>
                            <p className="text-xs text-muted-foreground">
                              {userData.twoFactorEnabled 
                                ? "Your account is protected with two-factor authentication"
                                : "Enhance your account security by enabling two-factor authentication"}
                            </p>
                          </div>
                        </div>
                        <Button variant={userData.twoFactorEnabled ? "outline" : "default"}>
                          {userData.twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Sessions</CardTitle>
                      <CardDescription>Manage your active login sessions and devices</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userData.deviceHistory.map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-muted">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center",
                              session.current ? "bg-primary/10" : "bg-muted"
                            )}>
                              <Smartphone className={cn(
                                "h-5 w-5",
                                session.current ? "text-primary" : "text-muted-foreground"
                              )} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{session.device}</p>
                                {session.current && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                                <span>{session.browser}</span>
                                <span>•</span>
                                <span>{session.location}</span>
                                <span>•</span>
                                <span>{formatDate(session.time)}</span>
                              </div>
                            </div>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  disabled={session.current}
                                  className={cn(!session.current && "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950")}
                                >
                                  {session.current ? "Active" : "Revoke"}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {session.current 
                                  ? "This is your current session" 
                                  : "Revoke access from this device"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                            <LogOut className="h-4 w-4" />
                            <span>Sign out of all other devices</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will immediately sign you out from all devices except this one.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">Sign out other devices</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="space-y-6 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Email Notifications</CardTitle>
                      <CardDescription>Configure which emails you receive from us</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-1">
                            <Label 
                              htmlFor="newsletter" 
                              className="text-base font-medium flex items-center gap-2"
                            >
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              Product Newsletter
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive our monthly newsletter with product updates and industry news
                            </p>
                          </div>
                          <Switch 
                            id="newsletter" 
                            checked={userData.newsletterSubscribed}
                            onCheckedChange={(checked) => setUserData({...userData, newsletterSubscribed: checked})}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-1">
                            <Label 
                              htmlFor="productUpdates" 
                              className="text-base font-medium flex items-center gap-2"
                            >
                              <Bell className="h-4 w-4 text-muted-foreground" />
                              Product Updates
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when we release new features and updates
                            </p>
                          </div>
                          <Switch 
                            id="productUpdates" 
                            checked={userData.productUpdates}
                            onCheckedChange={(checked) => setUserData({...userData, productUpdates: checked})}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-1">
                            <Label 
                              htmlFor="weeklyDigest" 
                              className="text-base font-medium flex items-center gap-2"
                            >
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              Weekly Activity Digest
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Weekly summary of your account activity and tasks
                            </p>
                          </div>
                          <Switch 
                            id="weeklyDigest" 
                            checked={userData.weeklyDigest}
                            onCheckedChange={(checked) => setUserData({...userData, weeklyDigest: checked})}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-1">
                            <Label 
                              htmlFor="securityAlerts" 
                              className="text-base font-medium flex items-center gap-2"
                            >
                              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                              Security Alerts
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive alerts about security incidents and suspicious activities
                            </p>
                          </div>
                          <Switch 
                            id="securityAlerts" 
                            checked={userData.securityAlerts}
                            onCheckedChange={(checked) => setUserData({...userData, securityAlerts: checked})}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Reset to Defaults</Button>
                      <Button>Save Preferences</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Communication Preferences</CardTitle>
                      <CardDescription>Manage how we contact you across the platform</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-3">
                          <Label className="text-base font-medium">Email Address</Label>
                          <div className="flex items-center gap-2">
                            <Input value={userData.email} readOnly className="flex-1" />
                            <Button variant="outline">Change</Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Your primary email used for all communications and login
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-col w-full text-sm">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <a href="#" className="text-primary hover:underline">
                            View our Privacy Policy
                          </a>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          Last updated: March 15, 2025
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}