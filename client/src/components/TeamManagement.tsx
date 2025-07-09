import React, { useState } from "react";
import { useUserRole, TeamMember, UserRole } from "@/contexts/UserRoleContext";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2, User, UserPlus, Shield, Mail, Smartphone } from "lucide-react";

// Define the form schema for adding a new team member
const teamMemberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(["admin", "manager", "team_lead", "analyst", "viewer"], {
    required_error: "Please select a role.",
  }),
  department: z.string().min(1, { message: "Please select a department." }),
  phone: z.string().optional(),
});

export default function TeamManagement() {
  const { teamMembers, userRole, updateTeamMember, addTeamMember, removeTeamMember } = useUserRole();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof teamMemberSchema>>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer",
      department: "marketing",
      phone: "",
    },
  });

  const editForm = useForm<z.infer<typeof teamMemberSchema>>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer",
      department: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof teamMemberSchema>) {
    const newMember: TeamMember = {
      id: Math.max(0, ...teamMembers.map(m => m.id)) + 1,
      name: values.name,
      email: values.email,
      role: values.role as UserRole,
      department: values.department,
      phone: values.phone || "",
      lastActive: new Date().toISOString(),
      avatar: null,
    };
    
    addTeamMember(newMember);
    setIsAddDialogOpen(false);
    form.reset();
  }

  function onEditSubmit(values: z.infer<typeof teamMemberSchema>) {
    if (!editMember) return;
    
    const updatedMember: TeamMember = {
      ...editMember,
      name: values.name,
      email: values.email,
      role: values.role as UserRole,
      department: values.department,
      phone: values.phone || "",
    };
    
    updateTeamMember(updatedMember);
    setEditMember(null);
  }

  function handleEditMember(member: TeamMember) {
    setEditMember(member);
    editForm.reset({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      phone: member.phone || "",
    });
  }

  function handleDeleteMember(member: TeamMember) {
    removeTeamMember(member.id);
    // Toast is handled in the context
  }

  // Filter members based on active tab
  const filteredMembers = teamMembers.filter(member => {
    if (activeTab === "all") return true;
    return member.role === activeTab;
  });

  // Get count of each role type for the tabs
  const roleCountMap: Record<string, number> = {
    all: teamMembers.length,
    admin: teamMembers.filter(m => m.role === "admin").length,
    manager: teamMembers.filter(m => m.role === "manager").length,
    team_lead: teamMembers.filter(m => m.role === "team_lead").length,
    analyst: teamMembers.filter(m => m.role === "analyst").length,
    viewer: teamMembers.filter(m => m.role === "viewer").length,
  };

  // Department options
  const departments = [
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "operations", label: "Operations" },
    { value: "finance", label: "Finance" },
    { value: "customer_service", label: "Customer Service" },
    { value: "it", label: "IT" },
    { value: "executive", label: "Executive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their access permissions.
          </p>
        </div>
        
        {userRole === "admin" && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <UserPlus className="h-4 w-4" />
                <span>Add Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Add a new team member to your organization. They will receive an email invitation.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="jane@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="team_lead">Team Lead</SelectItem>
                              <SelectItem value="analyst">Analyst</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept.value} value={dept.value}>
                                  {dept.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" className="w-full">Add Team Member</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="overflow-x-auto pb-px">
          <TabsTrigger value="all" className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>All</span>
            <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1 rounded-full">{roleCountMap.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>Admins</span>
            <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1 rounded-full">{roleCountMap.admin}</Badge>
          </TabsTrigger>
          <TabsTrigger value="manager" className="flex items-center gap-1.5">
            <span>Managers</span>
            <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1 rounded-full">{roleCountMap.manager}</Badge>
          </TabsTrigger>
          <TabsTrigger value="team_lead" className="flex items-center gap-1.5">
            <span>Team Leads</span>
            <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1 rounded-full">{roleCountMap.team_lead}</Badge>
          </TabsTrigger>
          <TabsTrigger value="analyst" className="flex items-center gap-1.5">
            <span>Analysts</span>
            <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1 rounded-full">{roleCountMap.analyst}</Badge>
          </TabsTrigger>
          <TabsTrigger value="viewer" className="flex items-center gap-1.5">
            <span>Viewers</span>
            <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1 rounded-full">{roleCountMap.viewer}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Active</TableHead>
                  <TableHead>Role</TableHead>
                  {userRole === "admin" && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={userRole === "admin" ? 6 : 5} className="text-center py-6 text-muted-foreground">
                      No team members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {member.avatar ? (
                              <AvatarImage src={member.avatar} alt={member.name} />
                            ) : (
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{member.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {departments.find(d => d.value === member.department)?.label || member.department}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(member.lastActive).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            member.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            member.role === 'manager' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                            member.role === 'team_lead' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            member.role === 'analyst' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }
                          variant="outline"
                        >
                          {member.role === 'team_lead' ? 'Team Lead' : 
                           member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                      </TableCell>
                      {userRole === "admin" && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              onClick={() => handleEditMember(member)} 
                              variant="ghost" 
                              size="icon"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              onClick={() => handleDeleteMember(member)} 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500"
                              disabled={member.role === "admin" && member.id === 1} // Prevent deleting the primary admin
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Dialog */}
      {editMember && (
        <Dialog open={!!editMember} onOpenChange={(open) => !open && setEditMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>
                Update information for {editMember.name}.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-2">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="team_lead">Team Lead</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}