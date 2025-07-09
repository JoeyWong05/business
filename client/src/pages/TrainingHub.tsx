import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { GraduationCap, BookOpen, FileText, PlayCircle, Search, Calendar, Clock, ChevronRight, Plus, MapPin, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/PageHeader";
import { useDemoMode } from "@/contexts/DemoModeContext";

export default function TrainingHub() {
  const { t } = useTranslation();
  const demoMode = useDemoMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("courses");
  
  // Demo data
  const coursesData = demoMode?.demoMode ? [
    {
      id: 1,
      title: "Digital Marketing Fundamentals",
      description: "Learn the fundamentals of digital marketing strategy and implementation",
      category: "Marketing",
      progress: 85,
      duration: "4 hours",
      lessons: 12,
      instructor: "Sarah Johnson",
      featured: true,
      image: "/courses/digital-marketing.jpg"
    },
    {
      id: 2,
      title: "Customer Service Excellence",
      description: "Master key skills for delivering exceptional customer service",
      category: "Customer Service",
      progress: 32,
      duration: "3 hours",
      lessons: 8,
      instructor: "David Wilson",
      featured: false,
      image: "/courses/customer-service.jpg"
    },
    {
      id: 3,
      title: "Project Management Essentials",
      description: "Learn essential methodologies and tools for successful project management",
      category: "Operations",
      progress: 0,
      duration: "6 hours",
      lessons: 15,
      instructor: "Michelle Zhang",
      featured: true,
      image: "/courses/project-management.jpg"
    },
    {
      id: 4,
      title: "Sales Techniques Masterclass",
      description: "Advanced sales techniques for closing deals and building client relationships",
      category: "Sales",
      progress: 65,
      duration: "5 hours",
      lessons: 10,
      instructor: "Robert Martinez",
      featured: false,
      image: "/courses/sales-techniques.jpg"
    },
    {
      id: 5,
      title: "Brand Strategy Workshop",
      description: "Develop and implement effective brand strategies for your business",
      category: "Marketing",
      progress: 12,
      duration: "4 hours",
      lessons: 9,
      instructor: "Emma Thompson",
      featured: false,
      image: "/courses/brand-strategy.jpg"
    },
    {
      id: 6,
      title: "Leadership Skills Development",
      description: "Essential leadership skills for managers and team leads",
      category: "Leadership",
      progress: 0,
      duration: "8 hours",
      lessons: 16,
      instructor: "James Wilson",
      featured: true,
      image: "/courses/leadership.jpg"
    }
  ] : [];
  
  const resourcesData = demoMode?.demoMode ? [
    {
      id: 1,
      title: "Employee Handbook",
      description: "Complete guide to company policies and procedures",
      type: "document",
      icon: <FileText className="h-10 w-10 text-blue-500" />,
      lastUpdated: "2 weeks ago"
    },
    {
      id: 2,
      title: "Onboarding Checklist",
      description: "Step-by-step guide for new employee onboarding",
      type: "document",
      icon: <FileText className="h-10 w-10 text-blue-500" />,
      lastUpdated: "1 month ago"
    },
    {
      id: 3,
      title: "Sales Pitch Templates",
      description: "Collection of effective sales pitch templates",
      type: "document",
      icon: <FileText className="h-10 w-10 text-blue-500" />,
      lastUpdated: "2 months ago"
    },
    {
      id: 4,
      title: "Customer Service Training Videos",
      description: "Series of training videos for customer service representatives",
      type: "video",
      icon: <PlayCircle className="h-10 w-10 text-red-500" />,
      lastUpdated: "3 weeks ago"
    },
    {
      id: 5,
      title: "Marketing Strategy Guide",
      description: "Comprehensive guide to developing effective marketing strategies",
      type: "document",
      icon: <FileText className="h-10 w-10 text-blue-500" />,
      lastUpdated: "1 month ago"
    },
    {
      id: 6,
      title: "Leadership Workshop Recordings",
      description: "Recordings from the quarterly leadership workshop",
      type: "video",
      icon: <PlayCircle className="h-10 w-10 text-red-500" />,
      lastUpdated: "2 weeks ago"
    }
  ] : [];
  
  const eventsData = demoMode?.demoMode ? [
    {
      id: 1,
      title: "New Employee Orientation",
      description: "Welcome session for all new team members",
      date: "May 15, 2023",
      time: "9:00 AM - 11:00 AM",
      location: "Conference Room A",
      attendees: 12
    },
    {
      id: 2,
      title: "Leadership Development Workshop",
      description: "Interactive workshop on key leadership principles",
      date: "May 20, 2023",
      time: "1:00 PM - 4:00 PM",
      location: "Training Center",
      attendees: 8
    },
    {
      id: 3,
      title: "Customer Service Refresher",
      description: "Refresher training on customer service best practices",
      date: "May 25, 2023",
      time: "10:00 AM - 12:00 PM",
      location: "Online (Zoom)",
      attendees: 15
    },
    {
      id: 4,
      title: "Sales Techniques Workshop",
      description: "Hands-on workshop for sales team members",
      date: "June 2, 2023",
      time: "2:00 PM - 5:00 PM",
      location: "Conference Room B",
      attendees: 10
    },
    {
      id: 5,
      title: "Quarterly Product Training",
      description: "Training session on new product features and updates",
      date: "June 10, 2023",
      time: "11:00 AM - 1:00 PM",
      location: "Online (Teams)",
      attendees: 20
    }
  ] : [];
  
  // Filter courses based on search term
  const filteredCourses = coursesData.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter resources based on search term
  const filteredResources = resourcesData.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter events based on search term
  const filteredEvents = eventsData.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title={t("hr.trainingHub")}
        subtitle={t("hr.trainingHubDescription")}
        icon={<GraduationCap className="h-6 w-6" />}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("hr.addTrainingResource")}
          </Button>
        }
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses, resources..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-6">
          <TabsTrigger value="courses">{t("hr.courses")}</TabsTrigger>
          <TabsTrigger value="resources">{t("hr.resources")}</TabsTrigger>
          <TabsTrigger value="events">{t("hr.events")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-6">
        {demoMode?.demoMode && filteredCourses.length > 0 ? (
          <>
            {/* Featured Courses */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("Featured Courses")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.filter(course => course.featured).map((course) => (
                  <Card key={course.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gray-100 relative">
                      {/* If we had actual images, they would go here */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 flex flex-col justify-center items-center">
                        <BookOpen className="h-12 w-12 text-primary/60 mb-2" />
                        <Badge className="absolute top-3 right-3">{course.category}</Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex-grow flex flex-col">
                      <div className="flex items-center mb-3 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{course.lessons} lessons</span>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{course.instructor}</span>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          {course.progress > 0 ? "Continue" : "Start"} <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* All Courses */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("All Courses")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.filter(course => !course.featured).map((course) => (
                  <Card key={course.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gray-100 relative">
                      {/* If we had actual images, they would go here */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 flex flex-col justify-center items-center">
                        <BookOpen className="h-12 w-12 text-primary/60 mb-2" />
                        <Badge className="absolute top-3 right-3">{course.category}</Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex-grow flex flex-col">
                      <div className="flex items-center mb-3 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{course.lessons} lessons</span>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{course.instructor}</span>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          {course.progress > 0 ? "Continue" : "Start"} <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm && demoMode?.demoMode ? "No courses found" : "No courses available"}
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {searchTerm && demoMode?.demoMode
                  ? "Try adjusting your search to find what you're looking for."
                  : "Add your first training course to start building your library."}
              </p>
              {!searchTerm && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Course
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="resources" className="mt-6">
        {demoMode?.demoMode && filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex">
                  <div className="mr-4 flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Updated {resource.lastUpdated}</span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm && demoMode?.demoMode ? "No resources found" : "No resources available"}
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {searchTerm && demoMode?.demoMode
                  ? "Try adjusting your search to find what you're looking for."
                  : "Add your first training resource to start building your library."}
              </p>
              {!searchTerm && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Resource
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="events" className="mt-6">
        {demoMode?.demoMode && filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 bg-primary/10 p-6 flex flex-col justify-center items-center text-center">
                      <Calendar className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">{event.date}</h4>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="font-medium text-lg mb-1">{event.title}</h3>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 md:flex md:items-center">
                      <Button>Register</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm && demoMode?.demoMode ? "No events found" : "No upcoming events"}
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {searchTerm && demoMode?.demoMode
                  ? "Try adjusting your search to find what you're looking for."
                  : "Schedule your first training event to get started."}
              </p>
              {!searchTerm && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Training Event
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