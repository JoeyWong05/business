import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  GraduationCap, 
  Search, 
  BookOpen, 
  Award, 
  Clock, 
  Star, 
  Filter, 
  BookMarked,
  Play,
  Users,
  BarChart,
  CheckCircle,
  XCircle,
  Crown,
  ArrowRight,
  CheckSquare,
  MessageSquare,
  FileText,
  Briefcase,
  Building,
  Layers,
  Puzzle,
  HandHelping,
  HelpCircle,
  Zap,
  Lightbulb,
  Video,
  FileCheck,
  PersonStanding,
  Medal,
  Download,
  Flame,
  RotateCw,
  Check
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  RecommendedTrainingPath, 
  EmployeeOnboardingChecklist,
  CertificationProgress,
  TeamLearningLeaderboard
} from "@/components/TrainingAcademyCard";
import { Link } from "wouter";

// Course interface
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  progress?: number;
  enrolled?: boolean;
  modules: number;
  completedModules?: number;
  instructor: string;
  rating: number;
  ratingCount: number;
  imageUrl?: string;
  skills: string[];
  popular?: boolean;
}

// Achievement interface
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  date?: string;
  category: string;
  points: number;
}

// Learning path interface
interface LearningPath {
  id: string;
  title: string;
  description: string;
  forUserType: 'employee' | 'partner' | 'all';
  estimatedCompletion: string;
  totalCourses: number;
  totalHours: number;
  progress?: number;
  certificationAwarded?: string;
  courses: string[]; // Course IDs
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  skills: string[];
  category: string;
}

// Module interface for course content
interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz' | 'exercise' | 'assessment';
  completed?: boolean;
  lockedUntil?: string; // Previous module ID that must be completed
  resources?: {
    title: string;
    url: string;
    type: 'pdf' | 'video' | 'link' | 'doc';
  }[];
}

// Certification interface
interface Certification {
  id: string;
  title: string;
  description: string;
  level: 'foundational' | 'professional' | 'expert' | 'specialist';
  requiredCourses: string[]; // Course IDs
  examDetails: {
    duration: string;
    passingScore: number;
    totalQuestions: number;
    attemptsAllowed: number;
  };
  benefits: string[];
  validFor: string; // e.g., "1 year"
  badgeImageUrl?: string;
  earners: number;
}

export default function TrainingAcademy() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  
  // Courses data
  const courses: Course[] = [
    {
      id: "course-1",
      title: "DMPHQ Dashboard Essentials",
      description: "Learn the core features and navigation of the DMPHQ platform",
      category: "core",
      difficulty: "beginner",
      estimatedTime: "45 min",
      progress: 65,
      enrolled: true,
      modules: 8,
      completedModules: 5,
      instructor: "Sarah Johnson",
      rating: 4.8,
      ratingCount: 124,
      imageUrl: "",
      skills: ["Dashboard", "Navigation", "Filters", "Reporting"],
      popular: true
    },
    {
      id: "course-2",
      title: "Advanced Data Analysis",
      description: "Master complex data analysis techniques and visualizations",
      category: "analytics",
      difficulty: "intermediate",
      estimatedTime: "1 hr 20 min",
      progress: 30,
      enrolled: true,
      modules: 6,
      completedModules: 2,
      instructor: "Michael Chen",
      rating: 4.6,
      ratingCount: 86,
      skills: ["Data Analysis", "Visualization", "Filtering", "Reporting"],
    },
    {
      id: "course-3",
      title: "Building Custom Dashboards",
      description: "Create personalized dashboards tailored to your business needs",
      category: "customization",
      difficulty: "intermediate",
      estimatedTime: "1 hr 10 min",
      modules: 7,
      instructor: "Jessica Rodriguez",
      rating: 4.7,
      ratingCount: 92,
      skills: ["Dashboard", "Customization", "Layouts", "Widgets"],
      popular: true
    },
    {
      id: "course-4",
      title: "Automation Workflows",
      description: "Automate routine tasks and create efficient business processes",
      category: "automation",
      difficulty: "advanced",
      estimatedTime: "1 hr 45 min",
      modules: 9,
      instructor: "David Kim",
      rating: 4.9,
      ratingCount: 65,
      skills: ["Automation", "Workflow", "Integration", "Efficiency"],
    },
    {
      id: "course-5",
      title: "Client Management Mastery",
      description: "Learn best practices for managing clients and projects",
      category: "business",
      difficulty: "beginner",
      estimatedTime: "55 min",
      modules: 5,
      instructor: "Emma Thompson",
      rating: 4.5,
      ratingCount: 78,
      skills: ["Client Management", "Communication", "Organization"],
    },
    {
      id: "course-6",
      title: "Data Security & Compliance",
      description: "Understand data protection, permissions and regulatory compliance",
      category: "security",
      difficulty: "intermediate",
      estimatedTime: "1 hr 15 min",
      modules: 6,
      instructor: "Robert Smith",
      rating: 4.6,
      ratingCount: 53,
      skills: ["Security", "Compliance", "Permissions", "Privacy"],
    },
  ];
  
  // Achievements data
  const achievements: Achievement[] = [
    {
      id: "achievement-1",
      name: "Fast Learner",
      description: "Complete 3 modules in a single day",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      earned: true,
      date: "Mar 15, 2025",
      category: "progress",
      points: 50
    },
    {
      id: "achievement-2",
      name: "Data Explorer",
      description: "View all analytics dashboards",
      icon: <BarChart className="h-5 w-5 text-purple-500" />,
      earned: true,
      date: "Mar 10, 2025",
      category: "exploration",
      points: 75
    },
    {
      id: "achievement-3",
      name: "Team Player",
      description: "Collaborate with 5 team members",
      icon: <Users className="h-5 w-5 text-green-500" />,
      earned: false,
      category: "collaboration",
      points: 100
    },
    {
      id: "achievement-4",
      name: "Certified DMPHQ Specialist",
      description: "Complete the DMPHQ certification course",
      icon: <Award className="h-5 w-5 text-amber-500" />,
      earned: false,
      category: "certification",
      points: 500
    },
    {
      id: "achievement-5",
      name: "First Steps",
      description: "Complete your first course module",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      earned: true,
      date: "Mar 5, 2025",
      category: "milestone",
      points: 25
    },
    {
      id: "achievement-6",
      name: "Automation Master",
      description: "Create 10 automation workflows",
      icon: <Crown className="h-5 w-5 text-yellow-500" />,
      earned: false,
      category: "expertise",
      points: 250
    },
  ];
  
  // Expert score calculation
  const expertScore = {
    total: 425,
    level: "Bronze",
    nextLevel: "Silver",
    pointsToNextLevel: 75,
    categories: {
      core: 85,
      analytics: 62,
      automation: 35,
      security: 20,
      business: 45
    }
  };
  
  // Filter courses based on search and selected filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchQuery 
      ? course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Learning paths data
  const learningPaths: LearningPath[] = [
    {
      id: "path-employee-1",
      title: "New Employee Onboarding",
      description: "Essential training for new employees to get up to speed with DMPHQ",
      forUserType: 'employee',
      estimatedCompletion: "2 weeks",
      totalCourses: 5,
      totalHours: 8,
      progress: 40,
      certificationAwarded: "DMPHQ Certified User",
      courses: ["course-1", "course-2", "course-5"],
      level: 'beginner',
      skills: ["Platform Navigation", "Data Analysis", "Client Management", "Task Management"],
      category: "onboarding"
    },
    {
      id: "path-partner-1",
      title: "Partner Integration Specialist",
      description: "Learn how to integrate your services with DMPHQ platform",
      forUserType: 'partner',
      estimatedCompletion: "3 weeks",
      totalCourses: 6,
      totalHours: 12,
      progress: 0,
      certificationAwarded: "DMPHQ Integration Partner",
      courses: ["course-3", "course-4", "course-6"],
      level: 'intermediate',
      skills: ["API Integration", "Customization", "Security", "Workflow Automation"],
      category: "integration"
    },
    {
      id: "path-all-1",
      title: "Advanced Analytics Mastery",
      description: "Master advanced data visualization and reporting techniques",
      forUserType: 'all',
      estimatedCompletion: "4 weeks",
      totalCourses: 4,
      totalHours: 10,
      progress: 0,
      certificationAwarded: "DMPHQ Analytics Specialist",
      courses: ["course-2", "course-3"],
      level: 'advanced',
      skills: ["Data Analysis", "Visualization", "Dashboard Customization", "Predictive Analytics"],
      category: "analytics"
    }
  ];
  
  // Course modules for the first course
  const courseModules: Record<string, CourseModule[]> = {
    "course-1": [
      {
        id: "module-1-1",
        title: "Introduction to DMPHQ",
        description: "Overview of the platform and its capabilities",
        duration: "10 min",
        type: "video",
        completed: true,
        resources: [
          {
            title: "Platform Overview Guide",
            url: "/resources/platform-overview.pdf",
            type: "pdf"
          }
        ]
      },
      {
        id: "module-1-2",
        title: "Dashboard Navigation",
        description: "Learn how to navigate the dashboard and customize your views",
        duration: "15 min",
        type: "video",
        completed: true,
        lockedUntil: "module-1-1",
        resources: [
          {
            title: "Navigation Cheat Sheet",
            url: "/resources/navigation-guide.pdf",
            type: "pdf"
          }
        ]
      },
      {
        id: "module-1-3",
        title: "Dashboard Configuration Quiz",
        description: "Test your knowledge of dashboard configuration",
        duration: "5 min",
        type: "quiz",
        completed: true,
        lockedUntil: "module-1-2"
      },
      {
        id: "module-1-4",
        title: "Working with Widgets",
        description: "Add and configure widgets on your dashboard",
        duration: "20 min",
        type: "video",
        completed: true,
        lockedUntil: "module-1-3"
      },
      {
        id: "module-1-5",
        title: "Creating Your First Report",
        description: "Learn to create and share reports with your team",
        duration: "30 min",
        type: "exercise",
        completed: true,
        lockedUntil: "module-1-4"
      },
      {
        id: "module-1-6",
        title: "Advanced Filtering",
        description: "Master advanced filtering techniques for better insights",
        duration: "25 min",
        type: "video",
        completed: false,
        lockedUntil: "module-1-5"
      },
      {
        id: "module-1-7",
        title: "Collaboration Features",
        description: "Learn how to collaborate with team members within the platform",
        duration: "15 min",
        type: "video",
        completed: false,
        lockedUntil: "module-1-6"
      },
      {
        id: "module-1-8",
        title: "Dashboard Essentials Assessment",
        description: "Final assessment to test your knowledge",
        duration: "20 min",
        type: "assessment",
        completed: false,
        lockedUntil: "module-1-7"
      }
    ]
  };
  
  // Certifications data
  const certifications: Certification[] = [
    {
      id: "cert-1",
      title: "DMPHQ Certified User",
      description: "Foundational certification for all DMPHQ users",
      level: "foundational",
      requiredCourses: ["course-1", "course-5"],
      examDetails: {
        duration: "1 hour",
        passingScore: 80,
        totalQuestions: 40,
        attemptsAllowed: 3
      },
      benefits: [
        "Official certification badge for your profile",
        "Access to certified user community",
        "Priority support access",
        "Feature early access program"
      ],
      validFor: "2 years",
      earners: 248
    },
    {
      id: "cert-2",
      title: "DMPHQ Analytics Specialist",
      description: "Advanced certification focused on data analytics capabilities",
      level: "professional",
      requiredCourses: ["course-2", "course-3"],
      examDetails: {
        duration: "1.5 hours",
        passingScore: 85,
        totalQuestions: 50,
        attemptsAllowed: 2
      },
      benefits: [
        "Professional certification badge",
        "Listing in certified analytics specialists directory",
        "Access to advanced analytics features",
        "Invitation to annual analytics summit"
      ],
      validFor: "2 years",
      earners: 126
    },
    {
      id: "cert-3",
      title: "DMPHQ Integration Partner",
      description: "Specialized certification for partners integrating with DMPHQ",
      level: "specialist",
      requiredCourses: ["course-3", "course-4", "course-6"],
      examDetails: {
        duration: "2 hours",
        passingScore: 85,
        totalQuestions: 60,
        attemptsAllowed: 2
      },
      benefits: [
        "Partner certification badge",
        "Listing in official partner directory",
        "API rate limit increases",
        "Partner support channel access",
        "Co-marketing opportunities"
      ],
      validFor: "1 year",
      earners: 57
    }
  ];
  
  // Additional state for selected course
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedUserType, setSelectedUserType] = useState<"all" | "employee" | "partner">("all");
  
  // Filter achievements
  const earnedAchievements = achievements.filter(a => a.earned);
  const pendingAchievements = achievements.filter(a => !a.earned);
  
  // Filter learning paths
  const filteredLearningPaths = learningPaths.filter(path => 
    selectedUserType === "all" || path.forUserType === selectedUserType || path.forUserType === "all"
  );
  
  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-8 w-8" /> Training Academy
          </h1>
          <p className="text-muted-foreground">
            Learn, grow, and become an expert in the DMPHQ platform
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2 rounded-md border p-2 px-4">
            <Crown className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="text-sm">
                <span className="font-medium">{expertScore.level}</span>
                <span className="text-muted-foreground"> Expert</span>
              </div>
              <div className="text-xs text-muted-foreground">{expertScore.total} points</div>
            </div>
          </div>
          <Button>Continue Learning</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Your Learning Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Learning Overview</CardTitle>
              <CardDescription>
                Track your progress and continue your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Enrolled Courses</div>
                  <div className="text-2xl font-bold mt-1">
                    {courses.filter(c => c.enrolled).length}
                  </div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Completed Modules</div>
                  <div className="text-2xl font-bold mt-1">
                    {courses.reduce((total, course) => total + (course.completedModules || 0), 0)}
                  </div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Achievements</div>
                  <div className="text-2xl font-bold mt-1">
                    {earnedAchievements.length}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Continue Learning</h3>
                
                {courses.filter(course => course.enrolled && course.progress && course.progress < 100)
                  .map(course => (
                  <div key={course.id} className="rounded-md border p-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {course.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Module {course.completedModules} of {course.modules}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="gap-1">
                        <Play className="h-3 w-3" /> Continue
                      </Button>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  </div>
                ))}
                
                {courses.filter(course => course.enrolled && course.progress && course.progress < 100).length === 0 && (
                  <div className="rounded-md border border-dashed p-6 flex flex-col items-center justify-center text-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground/60 mb-2" />
                    <h3 className="font-medium">No courses in progress</h3>
                    <p className="text-sm text-muted-foreground">
                      Enroll in a course to start learning
                    </p>
                    <Button variant="outline" className="mt-3">
                      Explore Courses
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Learning Paths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" /> Guided Learning Paths
              </CardTitle>
              <CardDescription>
                Structured learning paths to build your expertise
              </CardDescription>
              
              <div className="flex justify-start gap-2 mt-3">
                <Button 
                  variant={selectedUserType === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedUserType("all")}
                >
                  All Paths
                </Button>
                <Button 
                  variant={selectedUserType === "employee" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedUserType("employee")}
                >
                  For Employees
                </Button>
                <Button 
                  variant={selectedUserType === "partner" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedUserType("partner")}
                >
                  For Partners
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredLearningPaths.map((path) => {
                // Get courses for this path
                const pathCourses = path.courses.map(courseId => 
                  courses.find(c => c.id === courseId)
                ).filter(Boolean);
                
                return (
                  <div key={path.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{path.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {path.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline" className="bg-background/70">
                              {path.level}
                            </Badge>
                            <Badge variant="outline" className="bg-background/70">
                              {path.totalCourses} courses
                            </Badge>
                            <Badge variant="outline" className="bg-background/70">
                              {path.totalHours} hours
                            </Badge>
                            {path.certificationAwarded && (
                              <Badge variant="outline" className="bg-background/70 text-amber-500 border-amber-200">
                                <Award className="h-3 w-3 mr-1" /> Certification
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {path.forUserType !== "all" && (
                          <Badge variant={path.forUserType === "employee" ? "default" : "secondary"}>
                            For {path.forUserType === "employee" ? "Employees" : "Partners"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="text-sm font-medium mb-3">Included Courses:</h4>
                      <div className="space-y-2 mb-4">
                        {pathCourses.map((course, index) => (
                          <div key={course?.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-muted">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{course?.title}</div>
                                <div className="text-xs text-muted-foreground">{course?.estimatedTime}</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {course?.difficulty}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      {path.progress !== undefined && path.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Learning Path Progress</span>
                            <span>{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Estimated completion: <span className="font-medium">{path.estimatedCompletion}</span>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant={path.progress && path.progress > 0 ? "outline" : "default"} size="sm">
                              {path.progress && path.progress > 0 ? (
                                <>Continue Path</>
                              ) : (
                                <>Start Learning</>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>{path.title}</DialogTitle>
                              <DialogDescription>
                                {path.description}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="mt-4 space-y-4">
                              <div>
                                <h3 className="text-sm font-semibold mb-2">What you'll learn:</h3>
                                <div className="grid grid-cols-2 gap-2">
                                  {path.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span>{skill}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <Separator />
                              
                              <div>
                                <h3 className="text-sm font-semibold mb-2">Course Plan:</h3>
                                <div className="space-y-2">
                                  {pathCourses.map((course, index) => (
                                    <div key={course?.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50">
                                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                        {index + 1}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">{course?.title}</div>
                                        <div className="text-sm text-muted-foreground">{course?.description}</div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{course?.estimatedTime}</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <BookMarked className="h-3 w-3" />
                                            <span>{course?.modules} modules</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {path.certificationAwarded && (
                                <>
                                  <Separator />
                                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-md p-3">
                                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-medium">
                                      <Award className="h-5 w-5" />
                                      <span>Earn a Certification</span>
                                    </div>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                      Complete this learning path to earn the {path.certificationAwarded} certification.
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <DialogFooter className="gap-2 sm:gap-0">
                              <Button type="button" variant="outline">
                                Download Syllabus
                              </Button>
                              <Button type="button">
                                {path.progress && path.progress > 0 ? 'Continue Learning' : 'Enroll Now'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredLearningPaths.length === 0 && (
                <div className="border border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center">
                  <Layers className="h-10 w-10 text-muted-foreground/60 mb-3" />
                  <h3 className="font-medium">No matching learning paths found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Try selecting a different path type
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedUserType("all")}
                  >
                    View All Paths
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> Certifications
              </CardTitle>
              <CardDescription>
                Earn industry-recognized credentials for your skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="border rounded-lg overflow-hidden">
                  <div className={`p-4 ${
                    cert.level === 'foundational' ? 'bg-blue-50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30' :
                    cert.level === 'professional' ? 'bg-purple-50 dark:bg-purple-950/20 border-b border-purple-100 dark:border-purple-900/30' :
                    cert.level === 'expert' ? 'bg-red-50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/30' :
                    'bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          {cert.title}
                          <Badge variant="outline" className={`${
                            cert.level === 'foundational' ? 'bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                            cert.level === 'professional' ? 'bg-purple-100/50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' :
                            cert.level === 'expert' ? 'bg-red-100/50 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                            'bg-amber-100/50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                          }`}>
                            {cert.level}
                          </Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {cert.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">{cert.earners}+</div>
                        <div className="text-xs text-muted-foreground">Certified professionals</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium">Requirements:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {cert.requiredCourses.map((courseId) => {
                          const course = courses.find(c => c.id === courseId);
                          if (!course) return null;
                          
                          return (
                            <div key={courseId} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              <span className="truncate">{course.title}</span>
                            </div>
                          );
                        })}
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <span className="truncate">Pass certification exam ({cert.examDetails.passingScore}%+)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                      <h4 className="text-sm font-medium">Exam details:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Duration: {cert.examDetails.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-muted-foreground" />
                          <span>{cert.examDetails.totalQuestions} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Medal className="h-4 w-4 text-muted-foreground" />
                          <span>Valid for {cert.validFor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RotateCw className="h-4 w-4 text-muted-foreground" />
                          <span>{cert.examDetails.attemptsAllowed} attempts allowed</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-3">
                      <Button>View Certification Path</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Courses Catalog */}
          <Card>
            <CardHeader>
              <CardTitle>Course Catalog</CardTitle>
              <CardDescription>
                Explore available courses to enhance your skills
              </CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search courses..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    className="rounded-md border px-3 py-2 text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="core">Core</option>
                    <option value="analytics">Analytics</option>
                    <option value="customization">Customization</option>
                    <option value="automation">Automation</option>
                    <option value="business">Business</option>
                    <option value="security">Security</option>
                  </select>
                  
                  <select 
                    className="rounded-md border px-3 py-2 text-sm"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCourses.map(course => (
                  <div key={course.id} className="rounded-md border overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {course.description}
                          </p>
                        </div>
                        {course.popular && (
                          <Badge variant="secondary" className="h-fit">Popular</Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {course.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="outline" className="bg-background/80">
                            {skill}
                          </Badge>
                        ))}
                        {course.skills.length > 3 && (
                          <Badge variant="outline" className="bg-background/80">
                            +{course.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{course.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookMarked className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{course.modules} modules</span>
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant={course.enrolled ? "outline" : "default"}>
                            {course.enrolled ? 'Continue' : 'Enroll'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>{course.title}</DialogTitle>
                            <DialogDescription>
                              {course.description}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="mt-4 space-y-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{course.difficulty}</Badge>
                              <Badge variant="outline">{course.estimatedTime}</Badge>
                              <Badge variant="outline">{course.modules} modules</Badge>
                              <Badge variant="outline">{course.rating} ★ ({course.ratingCount})</Badge>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-semibold mb-2">Skills you'll gain:</h3>
                              <div className="flex flex-wrap gap-2">
                                {course.skills.map((skill, i) => (
                                  <Badge key={i} variant="secondary">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-sm font-semibold mb-2">Course Curriculum:</h3>
                              {courseModules[course.id] ? (
                                <div className="space-y-2">
                                  {courseModules[course.id].map((module, index) => (
                                    <div key={module.id} 
                                      className={`flex items-start gap-3 p-2 rounded-md ${
                                        module.completed 
                                          ? "bg-primary/5" 
                                          : module.lockedUntil && !courseModules[course.id].find(m => m.id === module.lockedUntil)?.completed
                                            ? "opacity-60"
                                            : "hover:bg-muted/50"
                                      }`}
                                    >
                                      <div className={`flex items-center justify-center h-6 w-6 rounded-full ${
                                        module.completed 
                                          ? "bg-primary text-white" 
                                          : "bg-muted"
                                      }`}>
                                        {module.completed ? <Check className="h-3 w-3" /> : index + 1}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium flex items-center gap-2">
                                          {module.title}
                                          {module.type === 'video' && <Video className="h-3 w-3 text-muted-foreground" />}
                                          {module.type === 'quiz' && <FileText className="h-3 w-3 text-muted-foreground" />}
                                          {module.type === 'exercise' && <Puzzle className="h-3 w-3 text-muted-foreground" />}
                                          {module.type === 'assessment' && <FileCheck className="h-3 w-3 text-muted-foreground" />}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{module.description}</div>
                                        <div className="flex items-center mt-1">
                                          <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                                          <span className="text-xs text-muted-foreground">{module.duration}</span>
                                        </div>
                                      </div>
                                      
                                      {module.completed ? (
                                        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                                          Completed
                                        </Badge>
                                      ) : module.lockedUntil && !courseModules[course.id].find(m => m.id === module.lockedUntil)?.completed ? (
                                        <Badge variant="outline" className="ml-2 bg-muted">
                                          Locked
                                        </Badge>
                                      ) : (
                                        <Button size="sm" variant="ghost" className="gap-1">
                                          <Play className="h-3 w-3" /> Start
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">
                                  This course has {course.modules} modules.
                                </div>
                              )}
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h3 className="text-sm font-semibold">About the instructor:</h3>
                              <div className="flex items-center gap-3 mt-2">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{course.instructor.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{course.instructor}</div>
                                  <div className="text-sm text-muted-foreground">Senior Product Trainer</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline">
                              Add to Wishlist
                            </Button>
                            <Button type="button">
                              {course.enrolled ? 'Continue Learning' : 'Enroll Now'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
                
                {filteredCourses.length === 0 && (
                  <div className="col-span-2 rounded-md border border-dashed p-6 flex flex-col items-center justify-center text-center">
                    <XCircle className="h-8 w-8 text-muted-foreground/60 mb-2" />
                    <h3 className="font-medium">No matching courses found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search filters
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-3"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedDifficulty('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Recommended Learning Path */}
          <RecommendedTrainingPath />
          
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" /> Achievements
              </CardTitle>
              <CardDescription>
                Track your progress and earn recognition
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <Tabs defaultValue="earned">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="earned">Earned ({earnedAchievements.length})</TabsTrigger>
                  <TabsTrigger value="available">Available ({pendingAchievements.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="earned" className="space-y-3 mt-0">
                  {earnedAchievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-md border">
                      <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{achievement.name}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            +{achievement.points} pts
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {achievement.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {earnedAchievements.length === 0 && (
                    <div className="text-center py-6">
                      <XCircle className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                      <h3 className="font-medium">No achievements yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete courses to earn achievements
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="available" className="space-y-3 mt-0">
                  {pendingAchievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-md border bg-muted/30">
                      <div className="rounded-full bg-muted p-2 flex-shrink-0">
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{achievement.name}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            +{achievement.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="text-sm">
                Total: <span className="font-medium">{expertScore.total} points</span>
              </div>
              <Link href="/academy/achievements">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Getting Started Checklist */}
          <EmployeeOnboardingChecklist />
          
          {/* Certification Progress */}
          <CertificationProgress />
          
          {/* Team Leaderboard */}
          <TeamLearningLeaderboard />
        </div>
      </div>
    </div>
  );
}