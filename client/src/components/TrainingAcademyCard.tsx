import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  ChevronRight, 
  Clock, 
  MapPin, 
  MoreHorizontal, 
  Play, 
  Award, 
  ArrowRight,
  GraduationCap,
  BookOpen,
  Zap,
  LightbulbIcon,
  CheckCircle,
  CheckCheck
} from "lucide-react";

/**
 * Recommended Training Path Component
 * Shows a personalized learning path for the user
 */
export function RecommendedTrainingPath() {
  const learningPath = [
    {
      id: "path-1",
      title: "DMPHQ Essentials",
      description: "Core platform functionality and navigation",
      progress: 65,
      estimated: "2 hours",
      courses: 3,
      level: "beginner"
    },
    {
      id: "path-2",
      title: "Data Analysis Mastery",
      description: "Advanced data visualization and reporting",
      progress: 0,
      estimated: "3.5 hours",
      courses: 4,
      level: "intermediate"
    },
    {
      id: "path-3",
      title: "Automation Expert",
      description: "Build advanced automation workflows",
      progress: 0,
      estimated: "4 hours",
      courses: 5,
      level: "advanced"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-primary" /> Learning Path
        </CardTitle>
        <CardDescription>
          Recommended training path based on your role
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {learningPath.map((path, index) => (
            <div key={path.id} className="relative">
              <div className="rounded-md border p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {index === 0 && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                      {path.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {path.description}
                    </p>
                  </div>
                  <Badge variant={
                    path.level === "beginner" 
                      ? "outline" 
                      : path.level === "intermediate" 
                        ? "secondary" 
                        : "destructive"
                  }>
                    {path.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{path.estimated}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{path.courses} courses</span>
                  </div>
                </div>
                {path.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-1.5 w-full" />
                  </div>
                )}
                <div className="mt-3 flex justify-end">
                  <Button size="sm" className="gap-1" variant={index === 0 ? "default" : "outline"}>
                    {index === 0 ? (
                      <>Continue <Play className="h-3 w-3" /></>
                    ) : (
                      <>Start</>
                    )}
                  </Button>
                </div>
              </div>
              {index < learningPath.length - 1 && (
                <div className="absolute left-6 top-full h-4 border-l border-dashed z-0" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="gap-1 ml-auto">
          View Complete Curriculum <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Employee Onboarding Checklist Component
 * Shows a checklist for new employees to complete
 */
export function EmployeeOnboardingChecklist() {
  // Checklist items
  const checklist = [
    { id: "check-1", title: "Complete profile setup", completed: true },
    { id: "check-2", title: "Watch platform overview video", completed: true },
    { id: "check-3", title: "Complete DMPHQ Essentials course", completed: false },
    { id: "check-4", title: "Connect with team members", completed: false },
    { id: "check-5", title: "Set up notifications", completed: false },
  ];
  
  // Calculate progress percentage
  const completedCount = checklist.filter(item => item.completed).length;
  const progress = Math.round((completedCount / checklist.length) * 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCheck className="h-5 w-5 text-primary" /> Getting Started
        </CardTitle>
        <CardDescription>
          Complete these tasks to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">Your progress</div>
          <Badge variant={progress < 50 ? "outline" : "secondary"}>
            {progress}% Complete
          </Badge>
        </div>
        <Progress value={progress} className="h-2 w-full" />
        
        <div className="space-y-2 mt-4">
          {checklist.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center gap-3 p-2 rounded-md ${
                item.completed ? "bg-primary/5" : "bg-card hover:bg-muted/50"
              }`}
            >
              <div className={`rounded-full p-1 ${
                item.completed 
                  ? "bg-primary text-white" 
                  : "border border-muted-foreground/30"
              }`}>
                {item.completed ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <div className="h-3 w-3" />
                )}
              </div>
              <span className={`text-sm ${
                item.completed ? "line-through text-muted-foreground" : "font-medium"
              }`}>
                {item.title}
              </span>
              {!item.completed && (
                <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="text-sm text-muted-foreground">
          {completedCount} of {checklist.length} tasks completed
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Certification Progress Component
 * Shows progress towards various certifications
 */
export function CertificationProgress() {
  const certifications = [
    {
      id: "cert-1",
      title: "DMPHQ Platform Certified User",
      progress: 65,
      requiredCourses: 3,
      completedCourses: 2,
      dueDate: "April 15, 2025",
      badgeUrl: "",
      color: "blue"
    },
    {
      id: "cert-2",
      title: "Data Analysis Specialist",
      progress: 20,
      requiredCourses: 5,
      completedCourses: 1,
      dueDate: "May 20, 2025",
      badgeUrl: "",
      color: "purple"
    },
    {
      id: "cert-3",
      title: "Automation Expert",
      progress: 0,
      requiredCourses: 4,
      completedCourses: 0,
      dueDate: "June 10, 2025",
      badgeUrl: "",
      color: "amber"
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" /> Certifications
        </CardTitle>
        <CardDescription>
          Track your certification progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="border rounded-md p-3">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium">{cert.title}</h4>
              <Badge variant={cert.progress > 50 ? "default" : "outline"}>
                {cert.progress}%
              </Badge>
            </div>
            
            <Progress value={cert.progress} className="h-2 mb-3 w-full" />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{cert.completedCourses}/{cert.requiredCourses} courses</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Due: {cert.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View All Certifications
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Team Learning Leaderboard Component
 * Shows a leaderboard of team members and their learning progress
 */
export function TeamLearningLeaderboard() {
  const teamMembers = [
    { id: 1, name: "Sarah Johnson", role: "Product Manager", points: 1250, badges: 8, completedCourses: 12 },
    { id: 2, name: "Michael Chen", role: "Designer", points: 980, badges: 6, completedCourses: 9 },
    { id: 3, name: "Alex Rodriguez", role: "Developer", points: 1320, badges: 9, completedCourses: 15 },
    { id: 4, name: "Emma Thompson", role: "Marketing", points: 750, badges: 5, completedCourses: 7 },
    { id: 5, name: "David Kim", role: "Sales", points: 890, badges: 6, completedCourses: 8 },
  ];
  
  // Sort team members by points (highest first)
  const sortedTeam = [...teamMembers].sort((a, b) => b.points - a.points);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" /> Team Leaderboard
        </CardTitle>
        <CardDescription>
          See how your team is performing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedTeam.map((member, index) => (
            <div key={member.id} className="flex items-center p-2 rounded-md hover:bg-muted/50">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                index === 0 
                  ? "bg-yellow-500 text-yellow-950" 
                  : index === 1 
                    ? "bg-gray-300 text-gray-800" 
                    : index === 2 
                      ? "bg-amber-700 text-amber-50" 
                      : "bg-muted text-muted-foreground"
              }`}>
                {index + 1}
              </div>
              <div className="ml-3 flex-1">
                <div className="font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.role}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{member.points}</div>
                <div className="text-xs text-muted-foreground">{member.completedCourses} courses</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View Complete Rankings
        </Button>
      </CardFooter>
    </Card>
  );
}