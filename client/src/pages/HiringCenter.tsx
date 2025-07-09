import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, FileText, Users, Search, Plus, Download, Filter } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useTranslation } from "react-i18next";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function HiringCenter() {
  const { t } = useTranslation();
  const demoMode = useDemoMode();
  const isDemoMode = demoMode?.demoMode || false;
  const [openJobDialog, setOpenJobDialog] = useState(false);
  
  // Demo data for job templates
  const jobTemplates = isDemoMode ? [
    {
      id: 1,
      title: "Marketing Manager",
      department: "Marketing",
      type: "Full-time",
      description: "We're looking for a Marketing Manager to lead our marketing initiatives...",
      responsibilities: [
        "Develop and implement marketing strategies across all channels",
        "Lead a team of marketing specialists",
        "Analyze campaign performance and optimize for ROI",
        "Collaborate with sales team to align messaging",
        "Manage marketing budget effectively"
      ],
      requirements: [
        "5+ years of marketing experience, with 2+ years in management",
        "Proven track record of successful marketing campaigns",
        "Experience with digital marketing platforms",
        "Strong analytical and leadership skills",
        "Bachelor's degree in Marketing or related field"
      ]
    },
    {
      id: 2,
      title: "Senior Developer",
      department: "Engineering",
      type: "Full-time",
      description: "Join our engineering team to build innovative solutions...",
      responsibilities: [
        "Design and implement software solutions",
        "Collaborate with cross-functional teams",
        "Mentor junior developers",
        "Contribute to architectural decisions",
        "Ensure code quality through testing and reviews"
      ],
      requirements: [
        "4+ years of professional software development experience",
        "Proficiency in TypeScript, React, and Node.js",
        "Experience with cloud services (AWS/Azure)",
        "Knowledge of CI/CD practices",
        "Computer Science degree or equivalent experience"
      ]
    },
    {
      id: 3,
      title: "Customer Support Specialist",
      department: "Support",
      type: "Full-time",
      description: "Help our customers succeed by providing exceptional support...",
      responsibilities: [
        "Respond to customer inquiries via email, chat, and phone",
        "Troubleshoot and resolve customer issues",
        "Document solutions for knowledge base",
        "Identify and escalate complex issues",
        "Collect and relay customer feedback to product teams"
      ],
      requirements: [
        "2+ years in customer service or support roles",
        "Excellent communication and problem-solving skills",
        "Ability to explain technical concepts clearly",
        "Experience with CRM systems",
        "Patient and empathetic attitude"
      ]
    },
    {
      id: 4,
      title: "Social Media Coordinator",
      department: "Marketing",
      type: "Part-time",
      description: "Create engaging content for our social media platforms...",
      responsibilities: [
        "Develop and schedule content for social platforms",
        "Engage with audience and respond to comments",
        "Monitor trends and adjust strategy accordingly",
        "Collaborate with marketing team on campaigns",
        "Track and report on social media metrics"
      ],
      requirements: [
        "2+ years experience managing social media accounts",
        "Proficiency with content creation tools",
        "Understanding of social media analytics",
        "Strong writing and communication skills",
        "Experience with paid social campaigns preferred"
      ]
    },
    {
      id: 5,
      title: "Operations Assistant",
      department: "Operations",
      type: "Full-time",
      description: "Support our operations team with day-to-day activities...",
      responsibilities: [
        "Assist with workflow management and process improvements",
        "Coordinate with vendors and suppliers",
        "Maintain inventory and order supplies",
        "Support team with administrative tasks",
        "Help prepare reports and presentations"
      ],
      requirements: [
        "1+ years in administrative or operations role",
        "Strong organizational and multitasking abilities",
        "Proficiency with MS Office or Google Workspace",
        "Attention to detail",
        "Problem-solving mindset"
      ]
    }
  ] : [];

  // Demo data for interview templates
  const interviewTemplates = isDemoMode ? [
    {
      id: 1,
      title: "Initial Phone Screening",
      description: "A brief 15-30 minute call to assess basic qualifications and interest",
      questions: [
        "Tell me about your background and experience",
        "What interests you about this position?",
        "What are your salary expectations?",
        "When would you be available to start?",
        "Do you have any questions about the role or company?"
      ]
    },
    {
      id: 2,
      title: "Technical Assessment",
      description: "Evaluate technical skills and problem-solving ability",
      questions: [
        "Describe a challenging technical problem you solved recently",
        "How do you stay current with industry trends and technologies?",
        "What's your approach to debugging a complex issue?",
        "How do you ensure code quality in your work?",
        "Technical question specific to role requirements"
      ]
    },
    {
      id: 3,
      title: "Culture & Team Fit",
      description: "Assess alignment with company values and team dynamics",
      questions: [
        "Describe your ideal work environment",
        "How do you handle disagreements with team members?",
        "Tell me about a time you went above and beyond for your team",
        "What motivates you in your work?",
        "How do you prioritize tasks when everything seems urgent?"
      ]
    },
    {
      id: 4,
      title: "Leadership & Management",
      description: "For management positions to evaluate leadership capabilities",
      questions: [
        "Describe your leadership style",
        "How do you motivate team members?",
        "Tell me about a time you had to make a difficult decision as a leader",
        "How do you handle underperforming team members?",
        "What's your approach to setting goals for your team?"
      ]
    }
  ] : [];

  // Demo data for hiring resources
  const hiringResources = isDemoMode ? [
    {
      id: 1,
      title: "Effective Job Description Guide",
      type: "PDF",
      description: "Learn how to write compelling job descriptions that attract top talent",
      size: "428KB",
      lastUpdated: "2 weeks ago"
    },
    {
      id: 2,
      title: "Interview Question Bank",
      type: "Spreadsheet",
      description: "300+ interview questions organized by skill and position type",
      size: "1.2MB",
      lastUpdated: "1 month ago"
    },
    {
      id: 3,
      title: "Remote Hiring Best Practices",
      type: "PDF",
      description: "Tips and strategies for recruiting and evaluating remote candidates",
      size: "624KB",
      lastUpdated: "3 weeks ago"
    },
    {
      id: 4,
      title: "Candidate Assessment Rubric",
      type: "Template",
      description: "Standardized evaluation criteria for consistent candidate assessment",
      size: "356KB",
      lastUpdated: "2 months ago"
    },
    {
      id: 5,
      title: "Onboarding Checklist",
      type: "Checklist",
      description: "Comprehensive new hire onboarding process with timeline",
      size: "210KB",
      lastUpdated: "1 month ago"
    }
  ] : [];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title={t("hr.hiringCenter")}
        subtitle={t("hr.hiringCenterDescription")}
        icon={<Briefcase className="h-6 w-6" />}
        actions={
          <Button onClick={() => setOpenJobDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("hr.postNewJob")}
          </Button>
        }
      />

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="templates">Job Templates</TabsTrigger>
          <TabsTrigger value="interviews">Interview Guides</TabsTrigger>
          <TabsTrigger value="resources">Hiring Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="flex justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-9"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </div>

          {isDemoMode && jobTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobTemplates.map((template) => (
                <Card key={template.id} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>{template.title}</CardTitle>
                    <CardDescription className="flex flex-wrap gap-2 mt-1">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                        {template.department}
                      </span>
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs">
                        {template.type}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Key Responsibilities:</h4>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {template.responsibilities.slice(0, 3).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                        {template.responsibilities.length > 3 && (
                          <li className="text-muted-foreground">+{template.responsibilities.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button variant="ghost" size="sm">
                      Preview
                    </Button>
                    <Button>
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Job Templates Yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Job templates help you quickly create consistent job postings.
                  Start by creating your first template.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Template
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="interviews" className="mt-6">
          <div className="flex justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search interview guides..."
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Guide
            </Button>
          </div>

          {isDemoMode && interviewTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interviewTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle>{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-medium mb-2">Sample Questions:</h4>
                    <ul className="text-sm space-y-2 list-decimal pl-5">
                      {template.questions.map((question, i) => (
                        <li key={i}>{question}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm">
                      Use Guide
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Interview Guides Yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Interview guides help you conduct structured, consistent interviews.
                  Start by creating your first guide.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Guide
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Alert className="mb-6 bg-primary/5 border-primary/10">
            <AlertDescription className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              <span>
                <strong>Pro Tip:</strong> Standardize your hiring process with these resources to improve consistency and reduce bias.
              </span>
            </AlertDescription>
          </Alert>

          {isDemoMode && hiringResources.length > 0 ? (
            <div className="space-y-4">
              {hiringResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-4 flex items-center justify-center h-full">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <CardContent className="flex-1 p-4">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{resource.title}</h3>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">{resource.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <span>{resource.size}</span>
                        <span className="mx-2">•</span>
                        <span>Updated {resource.lastUpdated}</span>
                      </div>
                    </CardContent>
                    <div className="pr-4">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Resources Yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Upload documents, templates, and guides to help streamline your hiring process.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Resource
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog for creating a new job posting */}
      <Dialog open={openJobDialog} onOpenChange={setOpenJobDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Job Posting</DialogTitle>
            <DialogDescription>
              Fill out the details below to create a new job posting. You can save it as a draft or publish it immediately.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input id="job-title" placeholder="e.g. Marketing Manager" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employment-type">Employment Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary-range">Salary Range (optional)</Label>
                <div className="flex space-x-2 items-center">
                  <Input id="salary-min" placeholder="Min" />
                  <span>—</span>
                  <Input id="salary-max" placeholder="Max" />
                  <Select defaultValue="yearly">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yearly">per year</SelectItem>
                      <SelectItem value="monthly">per month</SelectItem>
                      <SelectItem value="hourly">per hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea 
                  id="job-description" 
                  placeholder="Describe the role, responsibilities, and ideal candidate" 
                  className="min-h-32"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (optional)</Label>
                <Textarea 
                  id="benefits" 
                  placeholder="List the benefits and perks for this position"
                  className="min-h-20"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Application Settings</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="require-resume" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="require-resume" className="text-sm font-normal">
                        Require resume/CV
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="require-cover-letter" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="require-cover-letter" className="text-sm font-normal">
                        Require cover letter
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="require-portfolio" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="require-portfolio" className="text-sm font-normal">
                        Require portfolio/work samples
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="save-template" />
              <Label htmlFor="save-template" className="text-sm font-normal">
                Save as template
              </Label>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setOpenJobDialog(false)}>
                Save as Draft
              </Button>
              <Button onClick={() => setOpenJobDialog(false)}>
                Publish Job
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}