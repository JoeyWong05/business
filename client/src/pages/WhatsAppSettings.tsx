import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/MainLayout';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
  MessageSquare,
  BellRing,
  Clock,
  Phone,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  Users,
  RefreshCw,
  Save,
  QrCode,
  Smartphone,
  BellOff,
  Moon,
  Globe,
  CalendarClock,
  Tag
} from 'lucide-react';

// WhatsApp settings form schema
const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9\s\-\(\)]+$/, "Invalid phone number format"),
  countryCode: z.string().default("+1"),
  isActive: z.boolean().default(true),
  notifyMeetings: z.boolean().default(true),
  notifyDeadlines: z.boolean().default(true),
  notifyAssignments: z.boolean().default(true),
  notifyRecommendations: z.boolean().default(false),
  notifyCostAlerts: z.boolean().default(false),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
  timezone: z.string().default("UTC")
});

// WhatsApp Group form schema
const groupFormSchema = z.object({
  name: z.string().min(3, "Group name is required"),
  description: z.string().optional(),
  groupId: z.string().min(10, "Valid WhatsApp group ID is required"),
  categoryId: z.number().optional(),
  businessEntityId: z.number().optional(),
  notificationTypes: z.array(z.string()).default(["meetings", "deadlines"])
});

type WhatsAppSettingsFormValues = z.infer<typeof formSchema>;
type WhatsAppGroupFormValues = z.infer<typeof groupFormSchema>;

export default function WhatsAppSettings() {
  const [currentTab, setCurrentTab] = useState("settings");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch WhatsApp settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/whatsapp-settings'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Fetch WhatsApp groups
  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['/api/whatsapp-groups'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Fetch categories for group assignment
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Fetch business entities
  const { data: entities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Setup form for WhatsApp settings
  const form = useForm<WhatsAppSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: settings || {
      phoneNumber: "",
      countryCode: "+1",
      isActive: true,
      notifyMeetings: true,
      notifyDeadlines: true,
      notifyAssignments: true,
      notifyRecommendations: false,
      notifyCostAlerts: false,
      quietHoursStart: "",
      quietHoursEnd: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  });
  
  // Update form values when settings are loaded
  React.useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);
  
  // Setup form for WhatsApp group
  const groupForm = useForm<WhatsAppGroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: selectedGroup || {
      name: "",
      description: "",
      groupId: "",
      categoryId: undefined,
      businessEntityId: undefined,
      notificationTypes: ["meetings", "deadlines"]
    }
  });
  
  // Update group form values when a group is selected for editing
  React.useEffect(() => {
    if (selectedGroup) {
      groupForm.reset(selectedGroup);
    } else {
      groupForm.reset({
        name: "",
        description: "",
        groupId: "",
        categoryId: undefined,
        businessEntityId: undefined,
        notificationTypes: ["meetings", "deadlines"]
      });
    }
  }, [selectedGroup, groupForm]);
  
  // Save WhatsApp settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: WhatsAppSettingsFormValues) => {
      if (settings) {
        // Update existing settings
        return apiRequest(`/api/whatsapp-settings/${settings.id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      } else {
        // Create new settings
        return apiRequest('/api/whatsapp-settings', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp-settings'] });
      toast({
        title: "Settings saved",
        description: "Your WhatsApp notification settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save WhatsApp settings. Please try again.",
        variant: "destructive"
      });
      console.error("Error saving WhatsApp settings:", error);
    }
  });
  
  // Create WhatsApp group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (data: WhatsAppGroupFormValues) => {
      return apiRequest('/api/whatsapp-groups', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp-groups'] });
      toast({
        title: "Group connected",
        description: "WhatsApp group has been connected successfully.",
      });
      setGroupDialogOpen(false);
      setSelectedGroup(null);
      setIsEditingGroup(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to connect WhatsApp group. Please try again.",
        variant: "destructive"
      });
      console.error("Error connecting WhatsApp group:", error);
    }
  });
  
  // Update WhatsApp group mutation
  const updateGroupMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: WhatsAppGroupFormValues }) => {
      return apiRequest(`/api/whatsapp-groups/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp-groups'] });
      toast({
        title: "Group updated",
        description: "WhatsApp group settings have been updated.",
      });
      setGroupDialogOpen(false);
      setSelectedGroup(null);
      setIsEditingGroup(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update WhatsApp group. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating WhatsApp group:", error);
    }
  });
  
  // Delete WhatsApp group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/whatsapp-groups/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp-groups'] });
      toast({
        title: "Group disconnected",
        description: "WhatsApp group has been disconnected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to disconnect WhatsApp group. Please try again.",
        variant: "destructive"
      });
      console.error("Error disconnecting WhatsApp group:", error);
    }
  });
  
  // Handle WhatsApp settings form submission
  const onSubmitSettings = (data: WhatsAppSettingsFormValues) => {
    saveSettingsMutation.mutate(data);
  };
  
  // Handle WhatsApp group form submission
  const onSubmitGroup = (data: WhatsAppGroupFormValues) => {
    if (isEditingGroup && selectedGroup) {
      updateGroupMutation.mutate({ id: selectedGroup.id, data });
    } else {
      createGroupMutation.mutate(data);
    }
  };
  
  // Handle edit group
  const handleEditGroup = (id: number) => {
    const group = groups?.find((g: any) => g.id === id);
    if (group) {
      setSelectedGroup(group);
      setIsEditingGroup(true);
      setGroupDialogOpen(true);
    }
  };
  
  // Handle delete group
  const handleDeleteGroup = (id: number) => {
    if (confirm("Are you sure you want to disconnect this WhatsApp group?")) {
      deleteGroupMutation.mutate(id);
    }
  };
  
  // Handle connect to WhatsApp
  const handleConnectToWhatsApp = () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setShowQRCode(true);
      
      // Simulate successful connection after QR code scan
      setTimeout(() => {
        setIsConnecting(false);
        setShowQRCode(false);
        
        toast({
          title: "Connected successfully",
          description: "Your WhatsApp account has been connected.",
        });
        
        // Update form with sample phone number if not set
        if (!form.getValues('phoneNumber')) {
          form.setValue('phoneNumber', '5551234567');
        }
      }, 5000);
    }, 2000);
  };
  
  // Get category name by id
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return 'None';
    const category = categories?.find((c: any) => c.id === categoryId);
    return category?.name || 'Unknown';
  };
  
  // Get entity name by id
  const getEntityName = (entityId?: number) => {
    if (!entityId) return 'Personal';
    const entity = entities?.find((e: any) => e.id === entityId);
    return entity?.name || 'Unknown';
  };
  
  // Format notification types for display
  const formatNotificationTypes = (types: string[]) => {
    const typeMap: Record<string, string> = {
      meetings: 'Meetings',
      deadlines: 'Deadlines',
      assignments: 'Assignments',
      recommendations: 'Recommendations',
      costAlerts: 'Cost Alerts'
    };
    
    return types.map(type => typeMap[type] || type).join(', ');
  };
  
  return (
    <MainLayout 
      title="WhatsApp Integration"
      description="Manage WhatsApp notifications and group settings"
    >
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold">WhatsApp Integration</h2>
            <p className="text-muted-foreground">
              Connect WhatsApp for notifications and team communication
            </p>
          </div>
          
          <div className="flex space-x-2">
            {settings?.isActive ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                <Check className="mr-1 h-3 w-3" /> Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                <AlertCircle className="mr-1 h-3 w-3" /> Not Connected
              </Badge>
            )}
            <Button 
              variant="outline" 
              onClick={handleConnectToWhatsApp}
              disabled={isConnecting}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
              {settings?.isActive ? 'Reconnect' : 'Connect'} WhatsApp
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">
              <Smartphone className="mr-2 h-4 w-4" />
              Personal Settings
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Users className="mr-2 h-4 w-4" />
              WhatsApp Groups
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive WhatsApp notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="text-center py-4">Loading settings...</div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitSettings)} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="countryCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country Code</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select country code" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                                    <SelectItem value="+44">+44 (UK)</SelectItem>
                                    <SelectItem value="+61">+61 (Australia)</SelectItem>
                                    <SelectItem value="+91">+91 (India)</SelectItem>
                                    <SelectItem value="+49">+49 (Germany)</SelectItem>
                                    <SelectItem value="+33">+33 (France)</SelectItem>
                                    <SelectItem value="+81">+81 (Japan)</SelectItem>
                                    <SelectItem value="+86">+86 (China)</SelectItem>
                                    <SelectItem value="+52">+52 (Mexico)</SelectItem>
                                    <SelectItem value="+55">+55 (Brazil)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>WhatsApp Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your WhatsApp number" {...field} />
                                </FormControl>
                                <FormDescription>
                                  The phone number associated with your WhatsApp account
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="timezone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Timezone</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="UTC">UTC</SelectItem>
                                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                    <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                                    <SelectItem value="Asia/Tokyo">Japan (JST)</SelectItem>
                                    <SelectItem value="Asia/Shanghai">China (CST)</SelectItem>
                                    <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                                    <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Used for scheduling notifications based on your local time
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex flex-col space-y-2">
                            <Label>Quiet Hours</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <FormField
                                control={form.control}
                                name="quietHoursStart"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input 
                                        type="time" 
                                        placeholder="Start time" 
                                        {...field} 
                                        value={field.value || ''}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="quietHoursEnd"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input 
                                        type="time" 
                                        placeholder="End time" 
                                        {...field} 
                                        value={field.value || ''}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <p className="text-sm text-gray-500">
                              No notifications will be sent during quiet hours
                            </p>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Notification Preferences</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="isActive"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">WhatsApp Notifications</FormLabel>
                                    <FormDescription>
                                      Enable or disable all WhatsApp notifications
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="notifyMeetings"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Meeting Notifications</FormLabel>
                                    <FormDescription>
                                      Receive reminders for upcoming meetings
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={!form.getValues('isActive')}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="notifyDeadlines"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Deadline Alerts</FormLabel>
                                    <FormDescription>
                                      Get notified about approaching deadlines
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={!form.getValues('isActive')}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="notifyAssignments"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Assignment Notifications</FormLabel>
                                    <FormDescription>
                                      Get notified when you're assigned a task
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={!form.getValues('isActive')}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="notifyRecommendations"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">AI Recommendations</FormLabel>
                                    <FormDescription>
                                      Receive tool and productivity recommendations
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={!form.getValues('isActive')}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="notifyCostAlerts"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Cost Alerts</FormLabel>
                                    <FormDescription>
                                      Get alerted about unusual expenses or budget thresholds
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={!form.getValues('isActive')}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="submit" 
                          disabled={saveSettingsMutation.isPending}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Settings
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
            
            {showQRCode && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Connect WhatsApp</CardTitle>
                  <CardDescription>
                    Scan this QR code with your phone to connect WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="border border-gray-200 p-4 rounded-md">
                    <div className="h-64 w-64 bg-gray-100 flex items-center justify-center">
                      <QrCode className="h-48 w-48 text-gray-400" />
                    </div>
                    <p className="text-center mt-4 text-sm text-gray-500">
                      1. Open WhatsApp on your phone<br />
                      2. Tap Menu or Settings and select WhatsApp Web<br />
                      3. Point your phone to this screen to scan the code
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="groups" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Connected WhatsApp Groups</CardTitle>
                    <CardDescription>
                      Manage WhatsApp groups for team communication
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {groupsLoading ? (
                      <div className="text-center py-4">Loading groups...</div>
                    ) : groups && groups.length > 0 ? (
                      <div className="space-y-4">
                        {groups.map((group: any) => (
                          <div key={group.id} className="flex flex-col p-4 rounded-lg border">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{group.name}</h3>
                                <p className="text-sm text-gray-500">{group.description}</p>
                              </div>
                              <Badge variant="outline" className={group.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}>
                                {group.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                              <div className="flex items-center text-sm">
                                <Tag className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-gray-600">Category: </span>
                                <span className="ml-1">{getCategoryName(group.categoryId)}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-gray-600">Entity: </span>
                                <span className="ml-1">{getEntityName(group.businessEntityId)}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <BellRing className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-gray-600">Notifications: </span>
                                <span className="ml-1">{formatNotificationTypes(group.notificationTypes || [])}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <CalendarClock className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-gray-600">Last message: </span>
                                <span className="ml-1">
                                  {group.lastMessage ? new Date(group.lastMessage).toLocaleString() : 'Never'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex justify-end mt-4 space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditGroup(group.id)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteGroup(group.id)}
                              >
                                Disconnect
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-md">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium">No WhatsApp groups connected</h3>
                        <p className="mt-1 text-gray-500">
                          Connect your team's WhatsApp groups to receive notifications
                        </p>
                        <div className="mt-6">
                          <Button onClick={() => {
                            setIsEditingGroup(false);
                            setSelectedGroup(null);
                            setGroupDialogOpen(true);
                          }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Connect WhatsApp Group
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  {groups && groups.length > 0 && (
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setIsEditingGroup(false);
                          setSelectedGroup(null);
                          setGroupDialogOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Connect New WhatsApp Group
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Tips</CardTitle>
                    <CardDescription>
                      Make the most of WhatsApp integration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <MessageSquare className="h-4 w-4" />
                      <AlertTitle>Group Notifications</AlertTitle>
                      <AlertDescription>
                        WhatsApp groups can receive automated notifications for meetings, deadlines, and important updates.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <BellOff className="h-4 w-4" />
                      <AlertTitle>Quiet Hours</AlertTitle>
                      <AlertDescription>
                        Set quiet hours to prevent notifications during non-working hours or important meetings.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <Moon className="h-4 w-4" />
                      <AlertTitle>Time Zone Awareness</AlertTitle>
                      <AlertDescription>
                        The system respects each team member's time zone for notifications, ensuring they arrive at appropriate times.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {isEditingGroup ? 'Edit WhatsApp Group' : 'Connect WhatsApp Group'}
            </DialogTitle>
            <DialogDescription>
              {isEditingGroup 
                ? 'Update the settings for this WhatsApp group.' 
                : 'Connect a WhatsApp group to receive automated notifications.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...groupForm}>
            <form onSubmit={groupForm.handleSubmit(onSubmitGroup)} className="space-y-4">
              <FormField
                control={groupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter WhatsApp group name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={groupForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter group description" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={groupForm.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Group ID*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter WhatsApp group ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      The unique identifier for your WhatsApp group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={groupForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {categories?.map((category: any) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={groupForm.control}
                  name="businessEntityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Entity</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select entity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Personal</SelectItem>
                          {entities?.map((entity: any) => (
                            <SelectItem key={entity.id} value={entity.id.toString()}>
                              {entity.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createGroupMutation.isPending || updateGroupMutation.isPending}
                >
                  {isEditingGroup ? 'Update Group' : 'Connect Group'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}