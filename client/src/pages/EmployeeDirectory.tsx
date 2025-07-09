import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Users, UserPlus, Search, Filter, Mail, Phone, MapPin, Building2, Calendar, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PageHeader from "@/components/PageHeader";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function EmployeeDirectory() {
  const { t } = useTranslation();
  const demoMode = useDemoMode();
  const isDemoMode = demoMode?.demoMode || false;
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Demo data for employees
  const employees = isDemoMode ? [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      role: "Marketing Director",
      department: "Marketing",
      location: "Austin, TX",
      email: "sarah.johnson@example.com",
      phone: "(512) 555-1234",
      startDate: "June 2020",
      skills: ["Digital Marketing", "Team Leadership", "Content Strategy"],
      projects: ["Brand Refresh", "Website Redesign"],
      status: "active"
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
      role: "Senior Developer",
      department: "Engineering",
      location: "Remote",
      email: "michael.chen@example.com",
      phone: "(650) 555-2345",
      startDate: "August 2021",
      skills: ["React", "TypeScript", "Node.js", "AWS"],
      projects: ["Platform Migration", "API Redesign"],
      status: "active"
    },
    {
      id: 3,
      name: "Jessica Rodriguez",
      avatar: "/avatars/jessica.jpg",
      role: "Customer Success Manager",
      department: "Support",
      location: "Austin, TX",
      email: "jessica.rodriguez@example.com",
      phone: "(512) 555-3456",
      startDate: "March 2022",
      skills: ["Customer Relations", "Problem Solving", "CRM Systems"],
      projects: ["Client Onboarding Improvement"],
      status: "active"
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "/avatars/david.jpg",
      role: "Product Manager",
      department: "Product",
      location: "Remote",
      email: "david.kim@example.com",
      phone: "(415) 555-4567",
      startDate: "January 2021",
      skills: ["Product Development", "User Research", "Agile Methodologies"],
      projects: ["Feature Launch Q3", "User Testing Program"],
      status: "active"
    },
    {
      id: 5,
      name: "Emily Thompson",
      avatar: "/avatars/emily.jpg",
      role: "Sales Representative",
      department: "Sales",
      location: "Remote",
      email: "emily.thompson@example.com",
      phone: "(312) 555-5678",
      startDate: "October 2022",
      skills: ["B2B Sales", "Negotiation", "CRM", "Presentation"],
      projects: ["Enterprise Outreach"],
      status: "active"
    },
    {
      id: 6,
      name: "James Wilson",
      avatar: "/avatars/james.jpg",
      role: "Financial Analyst",
      department: "Finance",
      location: "Austin, TX",
      email: "james.wilson@example.com",
      phone: "(512) 555-6789",
      startDate: "May 2021",
      skills: ["Financial Modeling", "Forecasting", "Data Analysis"],
      projects: ["Q3 Financial Review", "Cost Optimization"],
      status: "active"
    },
    {
      id: 7,
      name: "Sophia Lee",
      avatar: "/avatars/sophia.jpg",
      role: "UX Designer",
      department: "Product",
      location: "Remote",
      email: "sophia.lee@example.com",
      phone: "(206) 555-7890",
      startDate: "April 2022",
      skills: ["UI/UX Design", "User Research", "Figma", "Prototyping"],
      projects: ["Mobile App Redesign", "Design System"],
      status: "active"
    },
    {
      id: 8,
      name: "Robert Martinez",
      avatar: "/avatars/robert.jpg",
      role: "Operations Manager",
      department: "Operations",
      location: "Austin, TX",
      email: "robert.martinez@example.com",
      phone: "(512) 555-8901",
      startDate: "November 2020",
      skills: ["Process Improvement", "Team Management", "Strategic Planning"],
      projects: ["Workflow Optimization", "Vendor Management"],
      status: "active"
    }
  ] : [];

  // Filter employees based on search term and selected filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === "" || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || 
      employee.department === selectedDepartment;
    
    const matchesLocation = selectedLocation === "all" || 
      employee.location === selectedLocation;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  // Get unique departments and locations for filters
  const departments = Array.from(new Set(employees.map(e => e.department)));
  const locations = Array.from(new Set(employees.map(e => e.location)));

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title={t("Employee Directory")}
        subtitle={t("Browse team members, departments, and contact information")}
        icon={<Users className="h-6 w-6" />}
        actions={
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            {t("Add Team Member")}
          </Button>
        }
      />

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or role..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <TabsList className="grid grid-cols-2 w-full md:w-64">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="mt-6">
          {isDemoMode && filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="overflow-hidden flex flex-col h-full">
                  <div className="bg-primary/10 pt-6 pb-4 px-6 flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium text-lg text-center">{employee.name}</h3>
                    <p className="text-sm text-center text-muted-foreground">{employee.role}</p>
                  </div>
                  <CardContent className="pt-4 flex-grow">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{employee.department}</p>
                          <p className="text-xs text-muted-foreground">Department</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{employee.location}</p>
                          <p className="text-xs text-muted-foreground">Location</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{employee.email}</p>
                          <p className="text-xs text-muted-foreground">Email</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{employee.phone}</p>
                          <p className="text-xs text-muted-foreground">Phone</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{employee.startDate}</p>
                          <p className="text-xs text-muted-foreground">Started</p>
                        </div>
                      </div>
                    </div>
                    
                    {employee.skills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {employee.skills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                          ))}
                          {employee.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{employee.skills.length - 3} more</Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button variant="outline" className="w-full">View Profile</Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {isDemoMode && searchTerm ? "No matches found" : "No team members yet"}
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  {isDemoMode && searchTerm 
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Add your first team member to start building your directory."}
                </p>
                {!searchTerm && (
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Team Member
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          {isDemoMode && filteredEmployees.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-3 text-sm font-medium">Name</th>
                        <th className="px-4 py-3 text-sm font-medium">Department</th>
                        <th className="px-4 py-3 text-sm font-medium">Location</th>
                        <th className="px-4 py-3 text-sm font-medium">Email</th>
                        <th className="px-4 py-3 text-sm font-medium">Phone</th>
                        <th className="px-4 py-3 text-sm font-medium">Started</th>
                        <th className="px-4 py-3 text-sm font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="border-b">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-xs text-muted-foreground">{employee.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{employee.department}</td>
                          <td className="px-4 py-3">{employee.location}</td>
                          <td className="px-4 py-3 text-sm">{employee.email}</td>
                          <td className="px-4 py-3 text-sm">{employee.phone}</td>
                          <td className="px-4 py-3 text-sm">{employee.startDate}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {isDemoMode && searchTerm ? "No matches found" : "No team members yet"}
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  {isDemoMode && searchTerm 
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Add your first team member to start building your directory."}
                </p>
                {!searchTerm && (
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Team Member
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}