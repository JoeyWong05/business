import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { 
  Plus, 
  Link2, 
  Bell, 
  Mail, 
  Calendar, 
  FileText, 
  Search, 
  BarChart, 
  UserPlus, 
  MessageSquare, 
  BriefcaseBusiness, 
  ChevronRight, 
  ChevronDown, 
  MoreHorizontal,
  Send,
  Tag,
  Edit,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'communication' | 'workflow' | 'finance' | 'marketing' | 'tools';
  action: () => void;
}

interface QuickActionBarProps {
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const QuickActionBar: React.FC<QuickActionBarProps> = ({ 
  className = '',
  isOpen,
  onOpenChange
}) => {
  const { settings } = usePersonalization();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Demo quick actions
  const quickActions: QuickAction[] = [
    {
      id: 'create-task',
      name: 'Create Task',
      description: 'Add a new task or to-do item',
      icon: <CheckSquare className="h-4 w-4" />,
      category: 'workflow',
      action: () => {
        toast({
          title: 'Task Creation',
          description: 'Task creation form would appear here',
        });
      }
    },
    {
      id: 'schedule-meeting',
      name: 'Schedule Meeting',
      description: 'Create a new calendar event',
      icon: <Calendar className="h-4 w-4" />,
      category: 'communication',
      action: () => {
        toast({
          title: 'Meeting Scheduler',
          description: 'Calendar interface would open here',
        });
      }
    },
    {
      id: 'create-invoice',
      name: 'Create Invoice',
      description: 'Generate a new invoice',
      icon: <FileText className="h-4 w-4" />,
      category: 'finance',
      action: () => {
        toast({
          title: 'Invoice Creator',
          description: 'Invoice creation form would appear here',
        });
      }
    },
    {
      id: 'send-email',
      name: 'Send Email',
      description: 'Compose and send an email',
      icon: <Mail className="h-4 w-4" />,
      category: 'communication',
      action: () => {
        toast({
          title: 'Email Composer',
          description: 'Email interface would open here',
        });
      }
    },
    {
      id: 'add-contact',
      name: 'Add Contact',
      description: 'Create a new contact record',
      icon: <UserPlus className="h-4 w-4" />,
      category: 'workflow',
      action: () => {
        toast({
          title: 'Contact Form',
          description: 'Contact creation form would appear here',
        });
      }
    },
    {
      id: 'run-report',
      name: 'Run Report',
      description: 'Generate a performance report',
      icon: <BarChart className="h-4 w-4" />,
      category: 'finance',
      action: () => {
        toast({
          title: 'Report Generator',
          description: 'Report options would display here',
        });
      }
    },
    {
      id: 'social-post',
      name: 'Social Media Post',
      description: 'Create and schedule content',
      icon: <MessageSquare className="h-4 w-4" />,
      category: 'marketing',
      action: () => {
        toast({
          title: 'Social Media',
          description: 'Social media posting interface would open here',
        });
      }
    },
    {
      id: 'create-proposal',
      name: 'Create Proposal',
      description: 'Draft a new business proposal',
      icon: <BriefcaseBusiness className="h-4 w-4" />,
      category: 'workflow',
      action: () => {
        toast({
          title: 'Proposal Creator',
          description: 'Proposal template selection would appear here',
        });
      }
    },
    {
      id: 'add-automation',
      name: 'New Automation',
      description: 'Set up an automated workflow',
      icon: <Link2 className="h-4 w-4" />,
      category: 'tools',
      action: () => {
        toast({
          title: 'Automation Builder',
          description: 'Automation workflow editor would open here',
        });
      }
    },
  ];
  
  // Filter actions based on search and category
  const filteredActions = quickActions.filter(action => {
    const matchesSearch = searchQuery === '' || 
      action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeTab === 'all' || action.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle controlled dialog state
  const dialogOpen = isOpen !== undefined ? isOpen : isDialogOpen;
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setIsDialogOpen(open);
    }
  };

  // Use Dialog component to prevent automatically showing up on mobile/tablet
  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 rounded-full shadow-md bg-primary text-primary-foreground hover:bg-primary/90 border-none"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Actions</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <Card className={`${className} shadow-none border-0`}>
          <CardHeader className="px-4 py-3 space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Customize Actions</DropdownMenuItem>
                  <DropdownMenuItem>Clear Recent</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 pb-3">
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 h-8 mb-3">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="communication" className="text-xs">Comms</TabsTrigger>
                  <TabsTrigger value="workflow" className="text-xs">Work</TabsTrigger>
                  <TabsTrigger value="finance" className="text-xs">Finance</TabsTrigger>
                  <TabsTrigger value="marketing" className="text-xs">Marketing</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="m-0">
                  <ScrollArea className="h-[280px] pr-4 -mr-4">
                    <div className="space-y-1">
                      {filteredActions.map((action) => (
                        <Button
                          key={action.id}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto py-2 px-2"
                          onClick={() => {
                            action.action();
                            handleOpenChange(false); // Close dialog after action
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <div className="p-1 rounded-md bg-primary/10 text-primary mt-0.5">
                              {action.icon}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{action.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {action.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                      
                      {filteredActions.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <div className="text-sm">No matching actions found</div>
                          <div className="text-xs mt-1">Try a different search or category</div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="border-t px-3 py-2 bg-muted/40">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Recent Actions</Label>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => {
                    toast({
                      title: 'Create Custom Action',
                      description: 'Custom action editor would open here',
                    });
                    handleOpenChange(false); // Close dialog after action
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="mt-1 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left h-auto py-1 px-1"
                  onClick={() => {
                    toast({
                      title: 'Schedule Team Meeting',
                      description: 'Calendar interface would open here',
                    });
                    handleOpenChange(false); // Close dialog after action
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-primary/10 text-primary">
                      <Calendar className="h-3 w-3" />
                    </div>
                    <span className="text-xs">Schedule Team Meeting</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left h-auto py-1 px-1"
                  onClick={() => {
                    toast({
                      title: 'Send Monthly Newsletter',
                      description: 'Email interface would open here',
                    });
                    handleOpenChange(false); // Close dialog after action
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-primary/10 text-primary">
                      <Send className="h-3 w-3" />
                    </div>
                    <span className="text-xs">Send Monthly Newsletter</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default QuickActionBar;