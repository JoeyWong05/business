import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Edit, 
  Key, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  CreditCard, 
  LogOut,
  Building,
  User,
  FileText,
  Briefcase,
  Clock,
  Check,
  X
} from 'lucide-react';
import { format } from 'date-fns';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  source: 'internal' | 'agency' | 'upwork' | 'freelance' | 'other';
  status: 'active' | 'inactive' | 'pending';
  accessLevel: 'admin' | 'editor' | 'viewer' | 'limited';
  entityAccess: number[]; // IDs of business entities they have access to
  platformAccess: string[]; // Platform names they have access to
  startDate: string;
  endDate?: string;
  avatarUrl?: string;
  lastActive?: string;
  agencyName?: string;
  hourlyRate?: number;
  contactInfo?: string;
}

export interface TeamMemberManagementProps {
  teamMembers: TeamMember[];
  entities: Array<{ id: number, name: string }>;
  platforms: Array<{ id: string, name: string, icon?: string }>;
  onAddMember?: (member: Omit<TeamMember, 'id'>) => void;
  onUpdateMember?: (id: number, updates: Partial<TeamMember>) => void;
  onDeleteMember?: (id: number) => void;
  onShareAccess?: (memberId: number, platformId: string) => void;
}

export default function TeamMemberManagement({
  teamMembers,
  entities,
  platforms,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onShareAccess
}: TeamMemberManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditMember, setShowEditMember] = useState<number | null>(null);
  const [newMember, setNewMember] = useState<any>({
    name: '',
    email: '',
    role: '',
    source: 'internal',
    status: 'active',
    accessLevel: 'editor',
    entityAccess: [],
    platformAccess: [],
    startDate: new Date().toISOString().split('T')[0]
  });

  // Filter members based on search and filters
  const filteredMembers = teamMembers
    .filter(member => {
      if (searchTerm === '') return true;
      
      return (
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter(member => {
      if (sourceFilter === 'all') return true;
      return member.source === sourceFilter;
    })
    .filter(member => {
      if (statusFilter === 'all') return true;
      return member.status === statusFilter;
    })
    .filter(member => {
      if (accessFilter === 'all') return true;
      return member.accessLevel === accessFilter;
    })
    .filter(member => {
      if (entityFilter === 'all') return true;
      return member.entityAccess.includes(parseInt(entityFilter));
    });

  // Handle adding a new team member
  const handleAddMember = () => {
    if (onAddMember) {
      onAddMember(newMember);
    }
    
    setShowAddDialog(false);
    setNewMember({
      name: '',
      email: '',
      role: '',
      source: 'internal',
      status: 'active',
      accessLevel: 'editor',
      entityAccess: [],
      platformAccess: [],
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  // Handle editing an existing team member
  const handleEditMember = (id: number) => {
    setShowEditMember(id);
    const member = teamMembers.find(m => m.id === id);
    if (member) {
      setNewMember({ ...member });
    }
  };

  // Handle saving edits to a team member
  const handleSaveEdit = () => {
    if (showEditMember !== null && onUpdateMember) {
      onUpdateMember(showEditMember, newMember);
    }
    setShowEditMember(null);
  };

  // Handle deleting a team member
  const handleDeleteMember = (id: number) => {
    if (onDeleteMember) {
      onDeleteMember(id);
    }
  };

  // Handle toggling entity access
  const toggleEntityAccess = (entityId: number) => {
    if (newMember.entityAccess.includes(entityId)) {
      setNewMember({
        ...newMember,
        entityAccess: newMember.entityAccess.filter((id: number) => id !== entityId)
      });
    } else {
      setNewMember({
        ...newMember,
        entityAccess: [...newMember.entityAccess, entityId]
      });
    }
  };

  // Handle toggling platform access
  const togglePlatformAccess = (platformId: string) => {
    if (newMember.platformAccess.includes(platformId)) {
      setNewMember({
        ...newMember,
        platformAccess: newMember.platformAccess.filter((id: string) => id !== platformId)
      });
    } else {
      setNewMember({
        ...newMember,
        platformAccess: [...newMember.platformAccess, platformId]
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get access level badge
  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'admin':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Admin</Badge>;
      case 'editor':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Editor</Badge>;
      case 'viewer':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">Viewer</Badge>;
      case 'limited':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Limited</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  // Get source badge
  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'internal':
        return <Badge variant="outline" className="flex gap-1 items-center"><Building className="h-3 w-3" /> Internal</Badge>;
      case 'agency':
        return <Badge variant="outline" className="flex gap-1 items-center"><Briefcase className="h-3 w-3" /> Agency</Badge>;
      case 'upwork':
        return <Badge variant="outline" className="flex gap-1 items-center bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">Upwork</Badge>;
      case 'freelance':
        return <Badge variant="outline" className="flex gap-1 items-center"><Clock className="h-3 w-3" /> Freelance</Badge>;
      default:
        return <Badge variant="outline">{source}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Member Management</CardTitle>
          <CardDescription>
            Manage team members, contractors, and their access permissions
          </CardDescription>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Add a new team member or contractor to your business
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="Jane Smith" 
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="jane@example.com" 
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  placeholder="Content Creator" 
                />
              </div>
              
              <div>
                <Label htmlFor="source">Source</Label>
                <Select 
                  value={newMember.source}
                  onValueChange={(value) => setNewMember({...newMember, source: value})}
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="upwork">Upwork</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(newMember.source === 'agency') && (
                <div className="col-span-2">
                  <Label htmlFor="agencyName">Agency Name</Label>
                  <Input 
                    id="agencyName" 
                    value={newMember.agencyName || ''}
                    onChange={(e) => setNewMember({...newMember, agencyName: e.target.value})}
                    placeholder="ABC Digital Agency" 
                  />
                </div>
              )}
              
              {(newMember.source === 'upwork' || newMember.source === 'freelance') && (
                <div className="col-span-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input 
                    id="hourlyRate" 
                    type="number"
                    value={newMember.hourlyRate || ''}
                    onChange={(e) => setNewMember({...newMember, hourlyRate: parseFloat(e.target.value)})}
                    placeholder="35.00" 
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={newMember.startDate}
                  onChange={(e) => setNewMember({...newMember, startDate: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date (optional)</Label>
                <Input 
                  id="endDate" 
                  type="date"
                  value={newMember.endDate || ''}
                  onChange={(e) => setNewMember({...newMember, endDate: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newMember.status}
                  onValueChange={(value) => setNewMember({...newMember, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="accessLevel">Access Level</Label>
                <Select 
                  value={newMember.accessLevel}
                  onValueChange={(value) => setNewMember({...newMember, accessLevel: value})}
                >
                  <SelectTrigger id="accessLevel">
                    <SelectValue placeholder="Access Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label>Entity Access</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {entities.map(entity => (
                    <div key={entity.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`entity-${entity.id}`} 
                        checked={newMember.entityAccess.includes(entity.id)}
                        onCheckedChange={() => toggleEntityAccess(entity.id)}
                      />
                      <Label htmlFor={`entity-${entity.id}`} className="font-normal">
                        {entity.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-span-2">
                <Label>Platform Access</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {platforms.map(platform => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`platform-${platform.id}`} 
                        checked={newMember.platformAccess.includes(platform.id)}
                        onCheckedChange={() => togglePlatformAccess(platform.id)}
                      />
                      <Label htmlFor={`platform-${platform.id}`} className="font-normal">
                        {platform.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddMember}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                className="pl-8 w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="upwork">Upwork</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Access Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{getSourceBadge(member.source)}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell>{getAccessLevelBadge(member.accessLevel)}</TableCell>
                      <TableCell>{formatDate(member.startDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Key className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Access Settings</SheetTitle>
                                <SheetDescription>
                                  Manage entity and platform access for {member.name}
                                </SheetDescription>
                              </SheetHeader>
                              <div className="py-6 space-y-6">
                                <div className="space-y-2">
                                  <h3 className="text-sm font-medium">Entity Access</h3>
                                  <div className="grid grid-cols-1 gap-2">
                                    {entities.map(entity => (
                                      <div key={entity.id} className="flex items-center justify-between py-2 border-b">
                                        <div className="flex items-center gap-2">
                                          <Building className="h-4 w-4 text-muted-foreground" />
                                          <span>{entity.name}</span>
                                        </div>
                                        <Badge variant={member.entityAccess.includes(entity.id) ? "default" : "outline"}>
                                          {member.entityAccess.includes(entity.id) ? 
                                            <Check className="mr-1 h-3 w-3" /> : 
                                            <X className="mr-1 h-3 w-3" />
                                          }
                                          {member.entityAccess.includes(entity.id) ? "Access" : "No Access"}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <h3 className="text-sm font-medium">Platform Access</h3>
                                  <div className="grid grid-cols-1 gap-2">
                                    {platforms.map(platform => (
                                      <div key={platform.id} className="flex items-center justify-between py-2 border-b">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-muted-foreground" />
                                          <span>{platform.name}</span>
                                        </div>
                                        <Badge variant={member.platformAccess.includes(platform.id) ? "default" : "outline"}>
                                          {member.platformAccess.includes(platform.id) ? 
                                            <Check className="mr-1 h-3 w-3" /> : 
                                            <X className="mr-1 h-3 w-3" />
                                          }
                                          {member.platformAccess.includes(platform.id) ? "Access" : "No Access"}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="pt-4">
                                  <Button className="w-full">
                                    Update Access Settings
                                  </Button>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                          
                          <Dialog open={showEditMember === member.id} onOpenChange={(open) => !open && setShowEditMember(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => handleEditMember(member.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[550px]">
                              <DialogHeader>
                                <DialogTitle>Edit Team Member</DialogTitle>
                                <DialogDescription>
                                  Update information for {member.name}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="col-span-2">
                                  <Label htmlFor="edit-name">Full Name</Label>
                                  <Input 
                                    id="edit-name" 
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                                  />
                                </div>
                                
                                <div className="col-span-2">
                                  <Label htmlFor="edit-email">Email Address</Label>
                                  <Input 
                                    id="edit-email" 
                                    type="email"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="edit-role">Role</Label>
                                  <Input 
                                    id="edit-role" 
                                    value={newMember.role}
                                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="edit-source">Source</Label>
                                  <Select 
                                    value={newMember.source}
                                    onValueChange={(value) => setNewMember({...newMember, source: value})}
                                  >
                                    <SelectTrigger id="edit-source">
                                      <SelectValue placeholder="Source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="internal">Internal</SelectItem>
                                      <SelectItem value="agency">Agency</SelectItem>
                                      <SelectItem value="upwork">Upwork</SelectItem>
                                      <SelectItem value="freelance">Freelance</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select 
                                    value={newMember.status}
                                    onValueChange={(value) => setNewMember({...newMember, status: value})}
                                  >
                                    <SelectTrigger id="edit-status">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                      <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <Label htmlFor="edit-accessLevel">Access Level</Label>
                                  <Select 
                                    value={newMember.accessLevel}
                                    onValueChange={(value) => setNewMember({...newMember, accessLevel: value})}
                                  >
                                    <SelectTrigger id="edit-accessLevel">
                                      <SelectValue placeholder="Access Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="editor">Editor</SelectItem>
                                      <SelectItem value="viewer">Viewer</SelectItem>
                                      <SelectItem value="limited">Limited</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowEditMember(null)}>Cancel</Button>
                                <Button variant="destructive" className="mr-auto" onClick={() => handleDeleteMember(member.id)}>
                                  <LogOut className="mr-2 h-4 w-4" />
                                  Remove
                                </Button>
                                <Button onClick={handleSaveEdit}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium mb-1">No team members found</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {searchTerm || sourceFilter !== 'all' || statusFilter !== 'all' || accessFilter !== 'all' || entityFilter !== 'all' 
                            ? "Try adjusting your search filters"
                            : "Start by adding your first team member"}
                        </p>
                        <Button onClick={() => setShowAddDialog(true)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add New Member
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredMembers.length} team members found
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}