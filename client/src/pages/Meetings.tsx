import React, { useState } from 'react';
import { format, addDays, subDays, setHours, setMinutes, differenceInMinutes } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MainLayout from '@/components/MainLayout';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
  Globe,
  Users,
  Calendar as CalendarIcon,
  Video,
  Clock,
  MapPin,
  Bell,
  Check,
  Plus,
  Trash2,
  Edit,
  MessageSquare,
  Phone,
  ArrowRight,
  Circle,
  AlarmClock,
  Repeat,
  BellRing,
  RefreshCw,
  CalendarDays,
  AlertCircle,
  Copy
} from 'lucide-react';

// Meeting form schema
const formSchema = z.object({
  title: z.string().min(3, "Title is required and must be at least 3 characters"),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  timezone: z.string().default("UTC"),
  location: z.string().optional(),
  meetingType: z.enum(["virtual", "in-person", "hybrid"]).default("virtual"),
  recurrence: z.enum(["none", "daily", "weekly", "monthly"]).default("none"),
  businessEntityId: z.number().optional(),
  notifyWhatsApp: z.boolean().default(false),
  notifyEmail: z.boolean().default(true),
  reminderMinutes: z.number().default(15),
  agendaItems: z.array(z.object({
    title: z.string(),
    duration: z.number().min(1),
    presenter: z.string().optional()
  })).default([]),
  attendees: z.array(z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.string().optional()
  })).default([])
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to format time
const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

// Meeting Status Badge
const MeetingStatusBadge = ({ status }: { status: string }) => {
  let badgeClass = "";
  let icon = null;
  
  switch (status) {
    case "scheduled":
      badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-200";
      icon = <CalendarIcon className="h-3 w-3 mr-1" />;
      break;
    case "in_progress":
      badgeClass = "bg-green-100 text-green-800 hover:bg-green-200";
      icon = <Circle className="h-3 w-3 mr-1 fill-green-500" />;
      break;
    case "completed":
      badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-200";
      icon = <Check className="h-3 w-3 mr-1" />;
      break;
    case "cancelled":
      badgeClass = "bg-red-100 text-red-800 hover:bg-red-200";
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
      break;
    default:
      badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
  
  return (
    <Badge variant="outline" className={badgeClass}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </Badge>
  );
};

// Meeting card component
const MeetingCard = ({ meeting, onEditClick }: { meeting: any, onEditClick: (id: number) => void }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{meeting.title}</CardTitle>
          <MeetingStatusBadge status={meeting.status} />
        </div>
        <CardDescription>
          {format(new Date(meeting.startTime), 'EEEE, MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {formatTime(new Date(meeting.startTime))} - {formatTime(new Date(meeting.endTime))}
            </span>
            <Badge variant="outline" className="ml-2 text-xs">
              {meeting.timezone}
            </Badge>
          </div>
          
          <div className="flex items-center text-sm">
            {meeting.meetingType === 'virtual' ? (
              <Video className="h-4 w-4 mr-2 text-gray-500" />
            ) : meeting.meetingType === 'hybrid' ? (
              <Globe className="h-4 w-4 mr-2 text-gray-500" />
            ) : (
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            )}
            <span>{meeting.location || `${meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1)} Meeting`}</span>
          </div>
          
          {meeting.recurrence !== 'none' && (
            <div className="flex items-center text-sm">
              <Repeat className="h-4 w-4 mr-2 text-gray-500" />
              <span>Repeats {meeting.recurrence}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span>{meeting.attendees?.length || 0} Attendees</span>
          </div>
          
          {meeting.notifyWhatsApp && (
            <div className="flex items-center text-sm">
              <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-green-600">WhatsApp Notifications Enabled</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4 mr-1" /> 
                  {meeting.reminderMinutes} min
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reminder will be sent {meeting.reminderMinutes} minutes before the meeting</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEditClick(meeting.id)}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy meeting invite</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

// Meeting form component
const MeetingForm = ({ onSubmit, onCancel, initialData, isEditing }: { 
  onSubmit: (data: FormValues) => void, 
  onCancel: () => void, 
  initialData?: any,
  isEditing: boolean
}) => {
  const [agendaItems, setAgendaItems] = useState(initialData?.agendaItems || []);
  const [attendees, setAttendees] = useState(initialData?.attendees || []);
  const [newAgendaItem, setNewAgendaItem] = useState({ title: '', duration: 15, presenter: '' });
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '', phone: '', role: '' });
  
  // Get business entities
  const { data: entities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      startTime: setHours(setMinutes(new Date(), 0), 9),
      endTime: setHours(setMinutes(new Date(), 0), 10),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      location: '',
      meetingType: 'virtual',
      recurrence: 'none',
      notifyWhatsApp: false,
      notifyEmail: true,
      reminderMinutes: 15,
      agendaItems: [],
      attendees: []
    }
  });
  
  // Add agenda item
  const handleAddAgendaItem = () => {
    if (newAgendaItem.title && newAgendaItem.duration > 0) {
      const updatedAgendaItems = [...agendaItems, newAgendaItem];
      setAgendaItems(updatedAgendaItems);
      form.setValue('agendaItems', updatedAgendaItems);
      setNewAgendaItem({ title: '', duration: 15, presenter: '' });
    }
  };
  
  // Remove agenda item
  const handleRemoveAgendaItem = (index: number) => {
    const updatedAgendaItems = agendaItems.filter((_, i) => i !== index);
    setAgendaItems(updatedAgendaItems);
    form.setValue('agendaItems', updatedAgendaItems);
  };
  
  // Add attendee
  const handleAddAttendee = () => {
    if (newAttendee.name) {
      const updatedAttendees = [...attendees, newAttendee];
      setAttendees(updatedAttendees);
      form.setValue('attendees', updatedAttendees);
      setNewAttendee({ name: '', email: '', phone: '', role: '' });
    }
  };
  
  // Remove attendee
  const handleRemoveAttendee = (index: number) => {
    const updatedAttendees = attendees.filter((_, i) => i !== index);
    setAttendees(updatedAttendees);
    form.setValue('attendees', updatedAttendees);
  };
  
  // Handle form submission
  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };
  
  // Calculate meeting duration
  const calculateDuration = () => {
    const startTime = form.getValues('startTime');
    const endTime = form.getValues('endTime');
    if (startTime && endTime) {
      return differenceInMinutes(endTime, startTime);
    }
    return 60;
  };
  
  // Update end time when start time changes
  const handleStartTimeChange = (time: Date) => {
    form.setValue('startTime', time);
    const duration = calculateDuration();
    const newEndTime = addDays(new Date(time), 0);
    newEndTime.setMinutes(time.getMinutes() + duration);
    form.setValue('endTime', newEndTime);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Title*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter meeting title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter meeting description or notes" 
                    className="min-h-[100px]" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time*</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input 
                        type="datetime-local" 
                        {...field}
                        value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          handleStartTimeChange(date);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time*</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field}
                      value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="meetingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Type</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      value={field.value} 
                      onValueChange={field.onChange}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="virtual" id="virtual" />
                        <Label htmlFor="virtual">Virtual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in-person" id="in-person" />
                        <Label htmlFor="in-person">In-person</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hybrid" id="hybrid" />
                        <Label htmlFor="hybrid">Hybrid</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.getValues('meetingType') === 'virtual' 
                      ? 'Meeting Link' 
                      : form.getValues('meetingType') === 'hybrid'
                        ? 'Meeting Link & Location'
                        : 'Location'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={
                        form.getValues('meetingType') === 'virtual' 
                          ? 'Enter meeting URL' 
                          : form.getValues('meetingType') === 'hybrid'
                            ? 'Enter meeting URL and physical location'
                            : 'Enter physical location'
                      } 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurrence</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recurrence pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">One-time Meeting</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="businessEntityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Entity</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value?.toString() || ''} 
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business entity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Personal</SelectItem>
                        {entities?.map((entity: any) => (
                          <SelectItem key={entity.id} value={entity.id.toString()}>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Notification Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="reminderMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value.toString()} 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reminder time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes before</SelectItem>
                        <SelectItem value="10">10 minutes before</SelectItem>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                        <SelectItem value="120">2 hours before</SelectItem>
                        <SelectItem value="1440">1 day before</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center space-x-6 pt-6">
              <FormField
                control={form.control}
                name="notifyEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                    <FormLabel className="m-0">Email notification</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notifyWhatsApp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                    <FormLabel className="m-0">WhatsApp notification</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Agenda Items</h3>
            <Badge variant="outline" className="text-sm">
              Meeting Duration: {calculateDuration()} minutes
            </Badge>
          </div>
          
          <div className="space-y-4">
            {agendaItems.length > 0 ? (
              <div className="space-y-2">
                {agendaItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-3">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {item.duration} min
                        </span>
                        {item.presenter && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" /> {item.presenter}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveAgendaItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No agenda items added yet
              </div>
            )}
            
            <div className="grid grid-cols-6 gap-2">
              <Input
                className="col-span-3"
                placeholder="Agenda item title"
                value={newAgendaItem.title}
                onChange={(e) => setNewAgendaItem({ ...newAgendaItem, title: e.target.value })}
              />
              <Input
                className="col-span-1"
                type="number"
                placeholder="Minutes"
                value={newAgendaItem.duration}
                onChange={(e) => setNewAgendaItem({ ...newAgendaItem, duration: parseInt(e.target.value) || 0 })}
              />
              <Input
                className="col-span-1"
                placeholder="Presenter"
                value={newAgendaItem.presenter}
                onChange={(e) => setNewAgendaItem({ ...newAgendaItem, presenter: e.target.value })}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="col-span-1"
                onClick={handleAddAgendaItem}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Attendees</h3>
          
          <div className="space-y-4">
            {attendees.length > 0 ? (
              <div className="space-y-2">
                {attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{attendee.name}</div>
                      <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                        {attendee.email && (
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {attendee.email}
                          </span>
                        )}
                        {attendee.phone && (
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> {attendee.phone}
                          </span>
                        )}
                        {attendee.role && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" /> {attendee.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveAttendee(index)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No attendees added yet
              </div>
            )}
            
            <div className="grid grid-cols-12 gap-2">
              <Input
                className="col-span-3"
                placeholder="Name"
                value={newAttendee.name}
                onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
              />
              <Input
                className="col-span-3"
                placeholder="Email"
                value={newAttendee.email}
                onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
              />
              <Input
                className="col-span-3"
                placeholder="Phone (for WhatsApp)"
                value={newAttendee.phone}
                onChange={(e) => setNewAttendee({ ...newAttendee, phone: e.target.value })}
              />
              <Input
                className="col-span-2"
                placeholder="Role"
                value={newAttendee.role}
                onChange={(e) => setNewAttendee({ ...newAttendee, role: e.target.value })}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="col-span-1"
                onClick={handleAddAttendee}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-6">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Meeting' : 'Create Meeting'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default function Meetings() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentTab, setCurrentTab] = useState("upcoming");
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch meetings
  const { data: meetings, isLoading } = useQuery({
    queryKey: ['/api/meetings'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Create meeting mutation
  const createMeetingMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest('/api/meetings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meetings'] });
      toast({
        title: "Meeting created",
        description: "Your meeting has been scheduled successfully.",
      });
      setMeetingDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create meeting. Please try again.",
        variant: "destructive"
      });
      console.error("Error creating meeting:", error);
    }
  });
  
  // Update meeting mutation
  const updateMeetingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: FormValues }) => {
      return apiRequest(`/api/meetings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meetings'] });
      toast({
        title: "Meeting updated",
        description: "Your meeting has been updated successfully.",
      });
      setMeetingDialogOpen(false);
      setSelectedMeeting(null);
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update meeting. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating meeting:", error);
    }
  });
  
  // Filter meetings
  const getFilteredMeetings = () => {
    if (!meetings) return [];
    
    const now = new Date();
    
    switch (currentTab) {
      case 'upcoming':
        return meetings.filter((meeting: any) => 
          new Date(meeting.startTime) > now && meeting.status !== 'cancelled'
        ).sort((a: any, b: any) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      case 'past':
        return meetings.filter((meeting: any) => 
          new Date(meeting.endTime) < now || meeting.status === 'completed'
        ).sort((a: any, b: any) => 
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      case 'date':
        if (!selectedDate) return [];
        return meetings.filter((meeting: any) => {
          const meetingDate = new Date(meeting.startTime);
          return meetingDate.getDate() === selectedDate.getDate() &&
                 meetingDate.getMonth() === selectedDate.getMonth() &&
                 meetingDate.getFullYear() === selectedDate.getFullYear();
        }).sort((a: any, b: any) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      default:
        return meetings;
    }
  };
  
  // Get dates with meetings for the calendar
  const getDatesWithMeetings = () => {
    if (!meetings) return [];
    
    const dates = meetings.map((meeting: any) => {
      const date = new Date(meeting.startTime);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    });
    
    // Remove duplicates
    return Array.from(new Set(dates.map(date => date.toISOString()))).map(dateStr => new Date(dateStr));
  };
  
  // Handle edit meeting
  const handleEditMeeting = (id: number) => {
    const meeting = meetings?.find((m: any) => m.id === id);
    if (meeting) {
      // Convert ISO strings to Date objects
      const formattedMeeting = {
        ...meeting,
        startTime: new Date(meeting.startTime),
        endTime: new Date(meeting.endTime)
      };
      
      setSelectedMeeting(formattedMeeting);
      setIsEditing(true);
      setMeetingDialogOpen(true);
    }
  };
  
  // Handle form submission
  const handleMeetingSubmit = (data: FormValues) => {
    if (isEditing && selectedMeeting) {
      updateMeetingMutation.mutate({ id: selectedMeeting.id, data });
    } else {
      createMeetingMutation.mutate(data);
    }
  };
  
  const filteredMeetings = getFilteredMeetings();
  const datesWithMeetings = getDatesWithMeetings();
  
  return (
    <MainLayout 
      title="Meetings"
      description="Organize and manage company meetings"
    >
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold">Meetings</h2>
            <p className="text-muted-foreground">
              Schedule and manage company-wide meetings
            </p>
          </div>
          
          <Button onClick={() => {
            setIsEditing(false);
            setSelectedMeeting(null);
            setMeetingDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Meeting
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="past">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Past
                </TabsTrigger>
                <TabsTrigger value="date">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  By Date
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-8">Loading meetings...</div>
                ) : filteredMeetings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMeetings.map((meeting: any) => (
                      <MeetingCard 
                        key={meeting.id} 
                        meeting={meeting} 
                        onEditClick={handleEditMeeting}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-md">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No upcoming meetings</h3>
                    <p className="mt-1 text-gray-500">
                      Get started by creating a new meeting.
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => {
                        setIsEditing(false);
                        setSelectedMeeting(null);
                        setMeetingDialogOpen(true);
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Meeting
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-8">Loading meetings...</div>
                ) : filteredMeetings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMeetings.map((meeting: any) => (
                      <MeetingCard 
                        key={meeting.id} 
                        meeting={meeting} 
                        onEditClick={handleEditMeeting}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-md">
                    <RefreshCw className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No past meetings</h3>
                    <p className="mt-1 text-gray-500">
                      Past meetings will appear here once completed.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="date" className="mt-6">
                {selectedDate && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">
                      Meetings for {format(selectedDate, 'MMMM d, yyyy')}
                    </h3>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="text-center py-8">Loading meetings...</div>
                ) : filteredMeetings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMeetings.map((meeting: any) => (
                      <MeetingCard 
                        key={meeting.id} 
                        meeting={meeting} 
                        onEditClick={handleEditMeeting}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-md">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No meetings on this date</h3>
                    <p className="mt-1 text-gray-500">
                      Select a different date or create a new meeting.
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => {
                        setIsEditing(false);
                        setSelectedMeeting(null);
                        setMeetingDialogOpen(true);
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Meeting
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  Select a date to view meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setCurrentTab("date");
                  }}
                  className="rounded-md border"
                  modifiers={{
                    hasMeeting: datesWithMeetings
                  }}
                  modifiersStyles={{
                    hasMeeting: {
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)'
                    }
                  }}
                />
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(subDays(new Date(), 1))}
                  >
                    Yesterday
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(addDays(new Date(), 1))}
                  >
                    Tomorrow
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>WhatsApp Groups</CardTitle>
                <CardDescription>
                  Send meeting invites to WhatsApp groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-md border">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <span>Operations Team</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-md border">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <span>Marketing Department</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-md border">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <span>Sales Team</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Connect WhatsApp Group
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Meeting' : 'Create New Meeting'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the meeting details below.' 
                : 'Fill in the details below to schedule a new meeting.'}
            </DialogDescription>
          </DialogHeader>
          
          <MeetingForm 
            onSubmit={handleMeetingSubmit}
            onCancel={() => {
              setMeetingDialogOpen(false);
              setSelectedMeeting(null);
              setIsEditing(false);
            }}
            initialData={selectedMeeting}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}