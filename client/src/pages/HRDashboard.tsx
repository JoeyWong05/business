import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, UserCheck, UserCog, Briefcase, GraduationCap, Award, Building2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useTranslation } from "react-i18next";
import { useDemoMode } from "@/contexts/DemoModeContext";

// Simple StatsCard component since it might not exist in the project
const StatsCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  description?: string; 
  trend?: { value: string; direction: "up" | "down"; period: string } 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${trend.direction === "up" ? "text-green-500" : "text-red-500"}`}>
            {trend.direction === "up" ? "↑" : "↓"} {trend.value} {trend.period}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function HRDashboard() {
  const { t } = useTranslation();
  const demoMode = useDemoMode();
  const isDemoMode = demoMode?.demoMode || false;
  
  // Demo data
  const teamStats = isDemoMode ? {
    totalEmployees: 28,
    fullTime: 18,
    partTime: 5,
    contractors: 5,
    openPositions: 3,
    recentHires: 2,
    retentionRate: 92,
    onboardingCompletion: 84,
    avgTrainingCompletion: 78,
    departments: [
      { name: "Operations", count: 8, color: "bg-blue-500" },
      { name: "Sales", count: 6, color: "bg-green-500" },
      { name: "Marketing", count: 4, color: "bg-yellow-500" },
      { name: "Product", count: 5, color: "bg-purple-500" },
      { name: "Finance", count: 2, color: "bg-pink-500" },
      { name: "Support", count: 3, color: "bg-orange-500" },
    ],
    offices: [
      { name: "Austin, TX", count: 12, color: "bg-indigo-500" },
      { name: "Remote", count: 16, color: "bg-teal-500" },
    ]
  } : {
    totalEmployees: 0,
    fullTime: 0,
    partTime: 0,
    contractors: 0,
    openPositions: 0,
    recentHires: 0,
    retentionRate: 0,
    onboardingCompletion: 0,
    avgTrainingCompletion: 0,
    departments: [],
    offices: []
  };

  const recentActivities = isDemoMode ? [
    { type: "hire", name: "Sarah Johnson", position: "Marketing Specialist", date: "2 days ago" },
    { type: "onboarding", name: "Michael Chen", stage: "Training", progress: 75, date: "1 week ago" },
    { type: "promotion", name: "Emily Rodriguez", from: "Sales Rep", to: "Sales Manager", date: "2 weeks ago" },
    { type: "hiring", position: "Senior Developer", applications: 12, stage: "Interview", date: "ongoing" },
    { type: "training", name: "Team Leadership", participants: 5, completion: 80, date: "ongoing" }
  ] : [];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title={t("HR Dashboard")}
        subtitle={t("Manage your team, track key metrics, and optimize HR processes")}
        icon={<Users className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t("Total Team Members")}
          value={teamStats.totalEmployees}
          icon={<Users className="h-5 w-5 text-blue-500" />}
          description={`${teamStats.fullTime} Full-time, ${teamStats.partTime} Part-time, ${teamStats.contractors} Contractors`}
          trend={isDemoMode ? { value: "+2", direction: "up", period: "from last month" } : undefined}
        />
        <StatsCard
          title={t("Open Positions")}
          value={teamStats.openPositions}
          icon={<Briefcase className="h-5 w-5 text-yellow-500" />}
          description={t("Actively recruiting")}
          trend={isDemoMode ? { value: "+1", direction: "up", period: "from last month" } : undefined}
        />
        <StatsCard
          title={t("Retention Rate")}
          value={`${teamStats.retentionRate}%`}
          icon={<UserCheck className="h-5 w-5 text-green-500" />}
          description={t("Annual retention")}
          trend={isDemoMode ? { value: "+3%", direction: "up", period: "from last year" } : undefined}
        />
        <StatsCard
          title={t("Onboarding Completion")}
          value={`${teamStats.onboardingCompletion}%`}
          icon={<UserPlus className="h-5 w-5 text-purple-500" />}
          description={t("Recent hires progress")}
          trend={isDemoMode ? { value: "+5%", direction: "up", period: "from last quarter" } : undefined}
        />
      </div>

      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="team">Team Overview</TabsTrigger>
          <TabsTrigger value="hiring">Hiring</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCog className="h-5 w-5 text-muted-foreground" />
                  <span>Department Breakdown</span>
                </CardTitle>
                <CardDescription>Distribution of team members across departments</CardDescription>
              </CardHeader>
              <CardContent>
                {isDemoMode ? (
                  <div className="space-y-4">
                    {teamStats.departments.map((dept, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{dept.name}</span>
                          <span className="font-medium">{dept.count} members</span>
                        </div>
                        <Progress value={(dept.count / teamStats.totalEmployees) * 100} className={dept.color} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                    <p>No department data available</p>
                    <p className="text-sm mt-1">Add your first department in Settings</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span>Office Locations</span>
                </CardTitle>
                <CardDescription>Distribution of team members by location</CardDescription>
              </CardHeader>
              <CardContent>
                {isDemoMode ? (
                  <div className="space-y-4">
                    {teamStats.offices.map((office, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{office.name}</span>
                          <span className="font-medium">{office.count} members</span>
                        </div>
                        <Progress value={(office.count / teamStats.totalEmployees) * 100} className={office.color} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                    <p>No office location data available</p>
                    <p className="text-sm mt-1">Add your first office in Settings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hiring" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Pipeline</CardTitle>
              <CardDescription>Status of current open positions and applicants</CardDescription>
            </CardHeader>
            <CardContent>
              {isDemoMode ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-2 py-3 text-sm font-medium">Position</th>
                        <th className="px-2 py-3 text-sm font-medium">Applications</th>
                        <th className="px-2 py-3 text-sm font-medium">Status</th>
                        <th className="px-2 py-3 text-sm font-medium">Department</th>
                        <th className="px-2 py-3 text-sm font-medium">Time Open</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-2 py-3">Marketing Manager</td>
                        <td className="px-2 py-3">15</td>
                        <td className="px-2 py-3">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Interviewing</span>
                        </td>
                        <td className="px-2 py-3">Marketing</td>
                        <td className="px-2 py-3">2 weeks</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-2 py-3">Senior Developer</td>
                        <td className="px-2 py-3">8</td>
                        <td className="px-2 py-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Final Round</span>
                        </td>
                        <td className="px-2 py-3">Product</td>
                        <td className="px-2 py-3">4 weeks</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-3">Customer Support Specialist</td>
                        <td className="px-2 py-3">22</td>
                        <td className="px-2 py-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Screening</span>
                        </td>
                        <td className="px-2 py-3">Support</td>
                        <td className="px-2 py-3">1 week</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                  <p>No active recruitment pipelines</p>
                  <p className="text-sm mt-1">Post your first job opening in the Hiring Center</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>New Hire Onboarding</CardTitle>
              <CardDescription>Progress of recently hired team members</CardDescription>
            </CardHeader>
            <CardContent>
              {isDemoMode ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Sarah Johnson</h4>
                        <p className="text-sm text-muted-foreground">Marketing Specialist</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">90% Complete</span>
                        <p className="text-sm text-muted-foreground mt-1">Started 2 weeks ago</p>
                      </div>
                    </div>
                    <Progress value={90} className="bg-green-100" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">Michael Chen</h4>
                        <p className="text-sm text-muted-foreground">Product Developer</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">60% Complete</span>
                        <p className="text-sm text-muted-foreground mt-1">Started 1 week ago</p>
                      </div>
                    </div>
                    <Progress value={60} className="bg-yellow-100" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                  <p>No active onboarding processes</p>
                  <p className="text-sm mt-1">New hires will appear here automatically</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <span>Training Programs</span>
              </CardTitle>
              <CardDescription>Ongoing and upcoming training initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              {isDemoMode ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h4 className="font-medium">Leadership Development</h4>
                      <p className="text-sm text-muted-foreground">5 participants • In progress</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="font-medium">75%</span>
                        <p className="text-xs text-muted-foreground">Completion</p>
                      </div>
                      <Progress value={75} className="w-24" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h4 className="font-medium">Customer Service Excellence</h4>
                      <p className="text-sm text-muted-foreground">8 participants • In progress</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="font-medium">40%</span>
                        <p className="text-xs text-muted-foreground">Completion</p>
                      </div>
                      <Progress value={40} className="w-24" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Technical Skills Workshop</h4>
                      <p className="text-sm text-muted-foreground">12 participants • Starting next week</p>
                    </div>
                    <div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Upcoming</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                  <p>No active training programs</p>
                  <p className="text-sm mt-1">Set up your first training in the Training Hub</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent HR Activities</CardTitle>
          <CardDescription>Latest hiring, onboarding, and team updates</CardDescription>
        </CardHeader>
        <CardContent>
          {isDemoMode && recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start space-x-3 py-2 border-b last:border-0">
                  {activity.type === "hire" && <UserPlus className="h-5 w-5 text-green-500 mt-0.5" />}
                  {activity.type === "onboarding" && <UserCheck className="h-5 w-5 text-blue-500 mt-0.5" />}
                  {activity.type === "promotion" && <Award className="h-5 w-5 text-yellow-500 mt-0.5" />}
                  {activity.type === "hiring" && <Briefcase className="h-5 w-5 text-purple-500 mt-0.5" />}
                  {activity.type === "training" && <GraduationCap className="h-5 w-5 text-indigo-500 mt-0.5" />}
                  
                  <div className="flex-1">
                    {activity.type === "hire" && (
                      <p><span className="font-medium">{activity.name}</span> was hired as {activity.position}</p>
                    )}
                    {activity.type === "onboarding" && (
                      <div>
                        <p><span className="font-medium">{activity.name}</span> is in {activity.stage} phase</p>
                        <Progress value={activity.progress} className="mt-1 h-1.5" />
                      </div>
                    )}
                    {activity.type === "promotion" && (
                      <p><span className="font-medium">{activity.name}</span> was promoted from {activity.from} to {activity.to}</p>
                    )}
                    {activity.type === "hiring" && (
                      <p><span className="font-medium">{activity.position}</span> has {activity.applications} applications in {activity.stage} stage</p>
                    )}
                    {activity.type === "training" && (
                      <p><span className="font-medium">{activity.name}</span> training has {activity.participants} participants with {activity.completion}% completion</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-0.5">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-20 text-center text-muted-foreground">
              <p>No recent HR activities</p>
              <p className="text-sm mt-1">Activities will appear here as they occur</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}