import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Clock, Plus, X, Edit, MapPin, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

interface TimeLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  entityId?: number;
  isPrimary?: boolean;
  color?: string;
}

interface BusinessEntity {
  id: number;
  name: string;
}

const defaultLocations: TimeLocation[] = [
  {
    id: 'houston',
    name: 'HQ - Houston',
    city: 'Houston',
    country: 'USA',
    timezone: 'America/Chicago',
    isPrimary: true,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    id: 'bangkok',
    name: 'Hide Cafe Bar',
    city: 'Bangkok',
    country: 'Thailand',
    timezone: 'Asia/Bangkok',
    entityId: 5,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
  }
];

// Common timezones for quick selection
const popularTimezones = [
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Anchorage', label: 'Anchorage (AKST/AKDT)' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
];

export default function TimeZoneWidget() {
  const [locations, setLocations] = useState<TimeLocation[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState<Partial<TimeLocation>>({});
  const { toast } = useToast();

  // Fetch entities for assigning locations
  const { data: entitiesData } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  const entities: BusinessEntity[] = entitiesData?.entities || [];

  // Update time every minute
  useEffect(() => {
    // Load saved locations from localStorage or use defaults
    const savedLocations = localStorage.getItem('timeLocations');
    if (savedLocations) {
      try {
        setLocations(JSON.parse(savedLocations));
      } catch (e) {
        console.error('Failed to parse saved locations:', e);
        setLocations(defaultLocations);
      }
    } else {
      setLocations(defaultLocations);
    }

    // Update current time every 30 seconds
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // Save locations to localStorage when changed
  useEffect(() => {
    if (locations.length > 0) {
      localStorage.setItem('timeLocations', JSON.stringify(locations));
    }
  }, [locations]);

  const addLocation = () => {
    if (!newLocation.name || !newLocation.timezone) {
      toast({
        title: "Missing information",
        description: "Please provide both a name and timezone.",
        variant: "destructive",
      });
      return;
    }

    const id = `loc-${Date.now()}`;
    const locationToAdd: TimeLocation = {
      id,
      name: newLocation.name,
      city: newLocation.city || '',
      country: newLocation.country || '',
      timezone: newLocation.timezone,
      entityId: newLocation.entityId,
      color: getRandomColorClass()
    };

    setLocations([...locations, locationToAdd]);
    setNewLocation({});
    setIsAddingLocation(false);
    
    toast({
      title: "Location added",
      description: `${locationToAdd.name} has been added to your time zones.`,
    });
  };

  const removeLocation = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const getRandomColorClass = () => {
    const colors = [
      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
      'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getFormattedTime = (timezone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: timezone,
      }).format(currentTime);
    } catch (e) {
      console.error('Invalid timezone:', timezone);
      return 'Invalid timezone';
    }
  };

  const getCurrentDate = (timezone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: timezone,
      }).format(currentTime);
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getTimeDifference = (timezone: string) => {
    try {
      // Get hours in Houston (primary location)
      const primaryLocation = locations.find(loc => loc.isPrimary) || locations[0];
      if (!primaryLocation) return '';
      
      const primaryTime = new Date(currentTime.toLocaleString('en-US', { timeZone: primaryLocation.timezone }));
      const locationTime = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }));
      
      // Calculate hour difference
      const hourDiff = (locationTime.getHours() - primaryTime.getHours() + 24) % 24;
      
      if (hourDiff === 0) return 'Same time';
      return hourDiff > 12 ? `${hourDiff - 24}h` : `+${hourDiff}h`;
    } catch (e) {
      return '';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Global Time Zones
          </CardTitle>
          <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Time Location</DialogTitle>
                <DialogDescription>
                  Add a new location to track time zones across your business operations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="location-name">Location Name</Label>
                  <Input 
                    id="location-name" 
                    placeholder="e.g., New York Office"
                    value={newLocation.name || ''}
                    onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location-city">City</Label>
                    <Input 
                      id="location-city" 
                      placeholder="City"
                      value={newLocation.city || ''}
                      onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location-country">Country</Label>
                    <Input 
                      id="location-country" 
                      placeholder="Country"
                      value={newLocation.country || ''}
                      onChange={(e) => setNewLocation({...newLocation, country: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select 
                    value={newLocation.timezone} 
                    onValueChange={(value) => setNewLocation({...newLocation, timezone: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularTimezones.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity">Business Entity (Optional)</Label>
                  <Select 
                    value={newLocation.entityId?.toString()} 
                    onValueChange={(value) => setNewLocation({
                      ...newLocation, 
                      entityId: value ? parseInt(value) : undefined
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {entities.map(entity => (
                        <SelectItem key={entity.id} value={entity.id.toString()}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingLocation(false)}>
                  Cancel
                </Button>
                <Button onClick={addLocation}>
                  Add Location
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {locations.map(location => (
            <div 
              key={location.id}
              className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", location.color)}>
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{getFormattedTime(location.timezone)}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {location.name} 
                    {location.isPrimary && <span className="ml-1 text-[10px] bg-primary/10 text-primary rounded-full px-1.5">Primary</span>}
                    {getTimeDifference(location.timezone) && !location.isPrimary && (
                      <span className="ml-1 text-muted-foreground text-[10px]">
                        ({getTimeDifference(location.timezone)})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground mr-2">
                  {getCurrentDate(location.timezone)}
                </span>
                {!location.isPrimary && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeLocation(location.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}