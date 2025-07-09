import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Cpu, Users, Clock, ChevronRight, Code, FileText, Settings } from "lucide-react";

interface Process {
  id: string;
  name: string;
  handledBy: 'ai' | 'team' | 'hybrid';
  automationLevel: number; // 0-100
  description?: string;
}

interface DepartmentAutomationProps {
  name: string;
  slug: string;
  icon: string;
  iconColor: string;
  overallAutomationScore: number; // 0-100
  processes: Process[];
  teamSize?: number;
  monthlyTimeSaved?: number; // in hours
}

export default function DepartmentAutomationCard({
  name,
  slug,
  icon,
  iconColor,
  overallAutomationScore,
  processes,
  teamSize = 0,
  monthlyTimeSaved = 0
}: DepartmentAutomationProps) {
  const [expanded, setExpanded] = useState(false);

  // Count process types
  const aiProcesses = processes.filter(p => p.handledBy === 'ai').length;
  const teamProcesses = processes.filter(p => p.handledBy === 'team').length;
  const hybridProcesses = processes.filter(p => p.handledBy === 'hybrid').length;
  
  // Sort processes by automation level (descending)
  const sortedProcesses = [...processes].sort((a, b) => b.automationLevel - a.automationLevel);

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`bg-slate-50 dark:bg-slate-800`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-md ${iconColor.replace("text-", "bg-")}/10 flex items-center justify-center mr-3`}>
              <span className={`material-icons text-xl ${iconColor}`}>{icon}</span>
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{processes.length} Processes</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-2xl">{overallAutomationScore}%</div>
            <span className="text-xs text-muted-foreground">Automation</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Overall Automation</span>
            <span>{getScoreLabel(overallAutomationScore)}</span>
          </div>
          <Progress value={overallAutomationScore} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-center">
            <div className="flex justify-center mb-1">
              <Cpu className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-sm font-medium">{aiProcesses}</div>
            <div className="text-xs text-muted-foreground">AI Processes</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-center">
            <div className="flex justify-center mb-1">
              <Users className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-sm font-medium">{teamProcesses}</div>
            <div className="text-xs text-muted-foreground">Team Processes</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-center">
            <div className="flex justify-center mb-1">
              <Settings className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-sm font-medium">{hybridProcesses}</div>
            <div className="text-xs text-muted-foreground">Hybrid Processes</div>
          </div>
        </div>
        
        {!expanded && processes.length > 0 && (
          <div className="space-y-3">
            {sortedProcesses.slice(0, 3).map(process => (
              <ProcessItem key={process.id} process={process} />
            ))}
            {processes.length > 3 && (
              <Button 
                variant="ghost" 
                className="w-full text-xs" 
                onClick={() => setExpanded(true)}
              >
                Show all {processes.length} processes <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        )}
        
        {expanded && (
          <Accordion type="single" collapsible className="mt-2">
            {sortedProcesses.map((process, index) => (
              <AccordionItem key={process.id} value={process.id}>
                <AccordionTrigger className="py-2 text-sm hover:no-underline">
                  <div className="flex items-center">
                    <ProcessTypeIcon type={process.handledBy} className="mr-2 h-4 w-4" />
                    <span>{process.name}</span>
                    <Badge 
                      variant={getProcessBadgeVariant(process.automationLevel)} 
                      className="ml-2 text-xs py-0"
                    >
                      {process.automationLevel}%
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pl-6">
                  {process.description || `This process is ${
                    process.handledBy === 'ai' ? 'fully automated by AI' : 
                    process.handledBy === 'hybrid' ? 'partially automated with AI assistance' : 
                    'handled manually by the team'
                  }.`}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 text-sm">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">{teamSize} Team Members</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">{monthlyTimeSaved} hrs saved/month</span>
        </div>
      </CardFooter>
    </Card>
  );
}

function ProcessItem({ process }: { process: Process }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded">
      <div className="flex items-center">
        <ProcessTypeIcon type={process.handledBy} className="mr-2 h-4 w-4" />
        <span className="text-sm">{process.name}</span>
      </div>
      <Badge 
        variant={getProcessBadgeVariant(process.automationLevel)} 
        className="text-xs py-0"
      >
        {process.automationLevel}%
      </Badge>
    </div>
  );
}

function ProcessTypeIcon({ type, className }: { type: 'ai' | 'team' | 'hybrid', className?: string }) {
  switch (type) {
    case 'ai':
      return <Cpu className={`text-blue-500 ${className}`} />;
    case 'team':
      return <Users className={`text-purple-500 ${className}`} />;
    case 'hybrid':
      return <Settings className={`text-green-500 ${className}`} />;
    default:
      return null;
  }
}

function getProcessBadgeVariant(score: number): "default" | "secondary" | "destructive" | "outline" {
  if (score >= 80) return "default";
  if (score >= 50) return "secondary";
  if (score >= 30) return "outline";
  return "destructive";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  if (score >= 20) return "Fair";
  return "Poor";
}