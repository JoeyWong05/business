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
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  Copy, 
  Edit, 
  Key, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  ExternalLink, 
  Download,
  Share2,
  Clock,
  User,
  Lock,
  Shield,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Rotate3D,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';

export enum CredentialType {
  PASSWORD = 'password',
  API_KEY = 'api_key',
  OTP_SEED = 'otp_seed',
  TOKEN = 'token',
  SSH_KEY = 'ssh_key',
  CERTIFICATE = 'certificate'
}

export interface Credential {
  id: string;
  name: string;
  username?: string;
  platform: string;
  platformUrl?: string;
  platformIconUrl?: string;
  entityId: number;
  entityName: string;
  type: CredentialType;
  lastModified: Date | string;
  expiresAt?: Date | string;
  lastAccessed?: Date | string;
  accessCount?: number;
  sharedWith?: {
    userId: number;
    userName: string;
    lastAccessed?: Date | string;
  }[];
  notes?: string;
  tags?: string[];
  category?: string;
}

export interface SecureCredentialsManagerProps {
  credentials: Credential[];
  entities: Array<{id: number, name: string}>;
  platforms: Array<{id: string, name: string, url?: string, iconUrl?: string}>;
  teamMembers: Array<{id: number, name: string, avatarUrl?: string}>;
  onAddCredential?: (credential: Omit<Credential, 'id'>) => void;
  onUpdateCredential?: (id: string, updates: Partial<Credential>) => void;
  onDeleteCredential?: (id: string) => void;
  onShareCredential?: (credentialId: string, userId: number) => void;
  onRevokeAccess?: (credentialId: string, userId: number) => void;
  onGenerateTemporaryAccess?: (credentialId: string, duration: number) => Promise<string>;
  onGenerateOtp?: (credentialId: string) => Promise<string>;
}

export default function SecureCredentialsManager({
  credentials,
  entities,
  platforms,
  teamMembers,
  onAddCredential,
  onUpdateCredential,
  onDeleteCredential,
  onShareCredential,
  onRevokeAccess,
  onGenerateTemporaryAccess,
  onGenerateOtp
}: SecureCredentialsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState<string | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<number[]>([]);
  const [temporaryAccess, setTemporaryAccess] = useState<string | null>(null);
  const [accessDuration, setAccessDuration] = useState(24);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [newCredential, setNewCredential] = useState<any>({
    name: '',
    platform: '',
    username: '',
    platformUrl: '',
    entityId: -1,
    type: CredentialType.PASSWORD,
    lastModified: new Date().toISOString(),
    tags: [],
    notes: '',
    category: ''
  });
  
  // Filter credentials based on search and filters
  const filteredCredentials = credentials
    .filter(credential => {
      if (searchTerm === '') return true;
      
      return (
        credential.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (credential.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        credential.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (credential.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || false)
      );
    })
    .filter(credential => {
      if (typeFilter === 'all') return true;
      return credential.type === typeFilter;
    })
    .filter(credential => {
      if (platformFilter === 'all') return true;
      return credential.platform === platformFilter;
    })
    .filter(credential => {
      if (entityFilter === 'all') return true;
      return credential.entityId === parseInt(entityFilter);
    });

  // Handle adding a new credential
  const handleAddCredential = () => {
    if (onAddCredential) {
      onAddCredential({
        ...newCredential,
        entityName: entities.find(e => e.id === newCredential.entityId)?.name || 'Unknown'
      });
    }
    
    setShowAddDialog(false);
    setNewCredential({
      name: '',
      platform: '',
      username: '',
      platformUrl: '',
      entityId: -1,
      type: CredentialType.PASSWORD,
      lastModified: new Date().toISOString(),
      tags: [],
      notes: '',
      category: ''
    });
  };

  // Handle sharing a credential
  const handleShareCredential = (credentialId: string) => {
    setShowShareDialog(credentialId);
    setSelectedCredential(credentials.find(c => c.id === credentialId) || null);
    setSelectedTeamMembers([]);
  };

  // Handle confirming sharing
  const handleConfirmShare = () => {
    if (showShareDialog && selectedTeamMembers.length > 0 && onShareCredential) {
      selectedTeamMembers.forEach(userId => {
        onShareCredential(showShareDialog, userId);
      });
    }
    
    setShowShareDialog(null);
    setSelectedTeamMembers([]);
  };

  // Handle revoking access
  const handleRevokeAccess = (credentialId: string, userId: number) => {
    if (onRevokeAccess) {
      onRevokeAccess(credentialId, userId);
    }
  };

  // Handle generating temporary access
  const handleGenerateTemporaryAccess = async (credentialId: string) => {
    if (onGenerateTemporaryAccess) {
      try {
        const accessUrl = await onGenerateTemporaryAccess(credentialId, accessDuration);
        setTemporaryAccess(accessUrl);
      } catch (error) {
        console.error('Failed to generate temporary access:', error);
      }
    }
  };

  // Handle generating OTP code
  const handleGenerateOtp = async (credentialId: string) => {
    if (onGenerateOtp) {
      try {
        const otpCode = await onGenerateOtp(credentialId);
        setGeneratedOtp(otpCode);
      } catch (error) {
        console.error('Failed to generate OTP code:', error);
      }
    }
  };

  // Format date for display
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  // Toggle team member selection for sharing
  const toggleTeamMemberSelection = (userId: number) => {
    if (selectedTeamMembers.includes(userId)) {
      setSelectedTeamMembers(selectedTeamMembers.filter(id => id !== userId));
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, userId]);
    }
  };

  // Get credential type badge
  const getCredentialTypeBadge = (type: CredentialType) => {
    switch (type) {
      case CredentialType.PASSWORD:
        return <Badge variant="outline" className="flex gap-1 items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"><Lock className="h-3 w-3" /> Password</Badge>;
      case CredentialType.API_KEY:
        return <Badge variant="outline" className="flex gap-1 items-center bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"><Key className="h-3 w-3" /> API Key</Badge>;
      case CredentialType.OTP_SEED:
        return <Badge variant="outline" className="flex gap-1 items-center bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"><RefreshCw className="h-3 w-3" /> OTP Seed</Badge>;
      case CredentialType.TOKEN:
        return <Badge variant="outline" className="flex gap-1 items-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><Shield className="h-3 w-3" /> Token</Badge>;
      case CredentialType.SSH_KEY:
        return <Badge variant="outline" className="flex gap-1 items-center bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"><Key className="h-3 w-3" /> SSH Key</Badge>;
      case CredentialType.CERTIFICATE:
        return <Badge variant="outline" className="flex gap-1 items-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"><Shield className="h-3 w-3" /> Certificate</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Check if credential is expiring soon (within 30 days)
  const isExpiringSoon = (expiresAt?: Date | string) => {
    if (!expiresAt) return false;
    
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    return expirationDate <= thirtyDaysFromNow && expirationDate > now;
  };

  // Check if credential is expired
  const isExpired = (expiresAt?: Date | string) => {
    if (!expiresAt) return false;
    
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    
    return expirationDate < now;
  };

  // Get expiration status badge
  const getExpirationBadge = (expiresAt?: Date | string) => {
    if (!expiresAt) return null;
    
    if (isExpired(expiresAt)) {
      return <Badge variant="destructive" className="flex gap-1 items-center"><XCircle className="h-3 w-3" /> Expired</Badge>;
    } else if (isExpiringSoon(expiresAt)) {
      return <Badge variant="outline" className="flex gap-1 items-center bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"><AlertTriangle className="h-3 w-3" /> Expiring Soon</Badge>;
    } else {
      return <Badge variant="outline" className="flex gap-1 items-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><CheckCircle className="h-3 w-3" /> Valid</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Secure Credentials Manager</CardTitle>
          <CardDescription>
            Manage passwords, API keys, and credentials securely across teams
          </CardDescription>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Credential
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Credential</DialogTitle>
              <DialogDescription>
                Store login credentials, API keys, and secure information
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2">
                <Label htmlFor="name">Credential Name</Label>
                <Input 
                  id="name" 
                  value={newCredential.name}
                  onChange={(e) => setNewCredential({...newCredential, name: e.target.value})}
                  placeholder="Main Instagram Account" 
                />
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={newCredential.type}
                  onValueChange={(value) => setNewCredential({...newCredential, type: value})}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Credential Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CredentialType.PASSWORD}>Password</SelectItem>
                    <SelectItem value={CredentialType.API_KEY}>API Key</SelectItem>
                    <SelectItem value={CredentialType.OTP_SEED}>OTP Seed</SelectItem>
                    <SelectItem value={CredentialType.TOKEN}>Token</SelectItem>
                    <SelectItem value={CredentialType.SSH_KEY}>SSH Key</SelectItem>
                    <SelectItem value={CredentialType.CERTIFICATE}>Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="entity">Business Entity</Label>
                <Select 
                  value={String(newCredential.entityId)}
                  onValueChange={(value) => setNewCredential({...newCredential, entityId: parseInt(value)})}
                >
                  <SelectTrigger id="entity">
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map(entity => (
                      <SelectItem key={entity.id} value={String(entity.id)}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="platform">Platform/Service</Label>
                <Select 
                  value={newCredential.platform}
                  onValueChange={(value) => {
                    const platformInfo = platforms.find(p => p.id === value);
                    setNewCredential({
                      ...newCredential, 
                      platform: platformInfo?.name || value,
                      platformUrl: platformInfo?.url || '',
                      platformIconUrl: platformInfo?.iconUrl || ''
                    });
                  }}
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="platformUrl">Platform URL (optional)</Label>
                <Input 
                  id="platformUrl" 
                  value={newCredential.platformUrl}
                  onChange={(e) => setNewCredential({...newCredential, platformUrl: e.target.value})}
                  placeholder="https://example.com" 
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="username">Username/Account (optional)</Label>
                <Input 
                  id="username" 
                  value={newCredential.username}
                  onChange={(e) => setNewCredential({...newCredential, username: e.target.value})}
                  placeholder="username@example.com" 
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="credValue">Credential Value</Label>
                <Input 
                  id="credValue" 
                  type="password"
                  placeholder="••••••••••••••••"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The value will be securely stored and cannot be viewed directly
                </p>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea 
                  id="notes" 
                  value={newCredential.notes}
                  onChange={(e) => setNewCredential({...newCredential, notes: e.target.value})}
                  placeholder="Additional information about this credential"
                  rows={3}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  value={newCredential.tags.join(', ')}
                  onChange={(e) => setNewCredential({
                    ...newCredential, 
                    tags: e.target.value.split(',').map((tag: string) => tag.trim()).filter(Boolean)
                  })}
                  placeholder="marketing, social, production" 
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="expiresAt">Expiration Date (optional)</Label>
                <Input 
                  id="expiresAt" 
                  type="date"
                  value={newCredential.expiresAt || ''}
                  onChange={(e) => setNewCredential({...newCredential, expiresAt: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddCredential}>Add Credential</Button>
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
                placeholder="Search credentials..."
                className="pl-8 w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={CredentialType.PASSWORD}>Passwords</SelectItem>
                  <SelectItem value={CredentialType.API_KEY}>API Keys</SelectItem>
                  <SelectItem value={CredentialType.OTP_SEED}>OTP Seeds</SelectItem>
                  <SelectItem value={CredentialType.TOKEN}>Tokens</SelectItem>
                  <SelectItem value={CredentialType.SSH_KEY}>SSH Keys</SelectItem>
                  <SelectItem value={CredentialType.CERTIFICATE}>Certificates</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {Array.from(new Set(credentials.map(cred => cred.platform)))
                    .map(platform => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={String(entity.id)}>
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
                  <TableHead>Credential</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCredentials.length > 0 ? (
                  filteredCredentials.map((credential) => (
                    <TableRow key={credential.id}>
                      <TableCell>
                        <div className="font-medium">{credential.name}</div>
                        {credential.username && (
                          <div className="text-sm text-muted-foreground">{credential.username}</div>
                        )}
                        {credential.tags && credential.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {credential.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {credential.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{credential.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {credential.platformIconUrl ? (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={credential.platformIconUrl} alt={credential.platform} />
                              <AvatarFallback>{credential.platform.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-xs">{credential.platform.substring(0, 1)}</span>
                            </div>
                          )}
                          <span>{credential.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>{credential.entityName}</TableCell>
                      <TableCell>{getCredentialTypeBadge(credential.type)}</TableCell>
                      <TableCell>{formatDate(credential.lastModified)}</TableCell>
                      <TableCell>
                        {credential.expiresAt ? (
                          getExpirationBadge(credential.expiresAt)
                        ) : (
                          <Badge variant="outline" className="flex gap-1 items-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <CheckCircle className="h-3 w-3" /> No Expiration
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShareCredential(credential.id)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          
                          {credential.type === CredentialType.OTP_SEED && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleGenerateOtp(credential.id)}
                                >
                                  <Rotate3D className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Generated OTP Code</DialogTitle>
                                  <DialogDescription>
                                    The code is valid for a short time period
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col items-center justify-center py-8">
                                  <div className="text-4xl font-mono tracking-wider mb-6">
                                    {generatedOtp || '123456'}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    This code will expire in 30 seconds
                                  </p>
                                </div>
                                <DialogFooter>
                                  <Button onClick={() => setGeneratedOtp(null)}>
                                    Close
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                <Key className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Generate Temporary Access</DialogTitle>
                                <DialogDescription>
                                  Create a one-time access link for {credential.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <div className="mb-4">
                                  <Label htmlFor="duration">Access Duration (hours)</Label>
                                  <Select
                                    value={String(accessDuration)}
                                    onValueChange={(value) => setAccessDuration(parseInt(value))}
                                  >
                                    <SelectTrigger id="duration">
                                      <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1 hour</SelectItem>
                                      <SelectItem value="4">4 hours</SelectItem>
                                      <SelectItem value="8">8 hours</SelectItem>
                                      <SelectItem value="24">24 hours</SelectItem>
                                      <SelectItem value="48">48 hours</SelectItem>
                                      <SelectItem value="72">72 hours</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                {temporaryAccess ? (
                                  <div className="mt-4">
                                    <Label htmlFor="temp-link">Temporary Access Link</Label>
                                    <div className="flex mt-2">
                                      <Input
                                        id="temp-link"
                                        value={temporaryAccess}
                                        readOnly
                                      />
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="ml-2"
                                        onClick={() => {
                                          navigator.clipboard.writeText(temporaryAccess);
                                          // Toast notification would go here
                                        }}
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                      This link will expire in {accessDuration} hours
                                    </p>
                                  </div>
                                ) : (
                                  <Button 
                                    className="w-full" 
                                    onClick={() => handleGenerateTemporaryAccess(credential.id)}
                                  >
                                    Generate Temporary Access
                                  </Button>
                                )}
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setTemporaryAccess(null)}>
                                  Close
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {credential.platformUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(credential.platformUrl, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          
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
                        <Lock className="h-12 w-12 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium mb-1">No credentials found</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {searchTerm || typeFilter !== 'all' || platformFilter !== 'all' || entityFilter !== 'all' 
                            ? "Try adjusting your search filters"
                            : "Start by adding your first credential"}
                        </p>
                        <Button onClick={() => setShowAddDialog(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Credential
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
          <div className="flex items-center gap-2">
            <EyeOff className="h-4 w-4" />
            <span>All credentials are stored securely and encrypted at rest</span>
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Inventory
          </Button>
        </div>
      </CardFooter>
      
      {/* Share Credential Dialog */}
      <Dialog open={!!showShareDialog} onOpenChange={(open) => !open && setShowShareDialog(null)}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Share Credential Access</DialogTitle>
            <DialogDescription>
              Grant access to {selectedCredential?.name} for team members
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800">
              <Avatar className="h-10 w-10">
                {selectedCredential?.platformIconUrl ? (
                  <AvatarImage src={selectedCredential.platformIconUrl} />
                ) : (
                  <AvatarFallback>{selectedCredential?.platform.substring(0, 1) || '?'}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedCredential?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedCredential?.username || selectedCredential?.platform}
                </p>
              </div>
              {getCredentialTypeBadge(selectedCredential?.type || CredentialType.PASSWORD)}
            </div>
            
            <Label>Select Team Members</Label>
            <div className="border rounded-md mt-2 max-h-48 overflow-y-auto">
              {teamMembers.map(member => {
                // Check if member already has access
                const hasAccess = selectedCredential?.sharedWith?.some(
                  user => user.userId === member.id
                );
                
                return (
                  <div 
                    key={member.id}
                    className={`flex items-center justify-between p-3 border-b last:border-b-0 ${
                      hasAccess ? 'bg-gray-50 dark:bg-gray-800' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                      </div>
                    </div>
                    {hasAccess ? (
                      <Badge variant="outline" className="flex gap-1 items-center">
                        <CheckCircle className="h-3 w-3" /> Has Access
                      </Badge>
                    ) : (
                      <Checkbox 
                        checked={selectedTeamMembers.includes(member.id)}
                        onCheckedChange={() => toggleTeamMemberSelection(member.id)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            
            {selectedCredential?.sharedWith && selectedCredential.sharedWith.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Currently Shared With</h4>
                {selectedCredential.sharedWith.map(user => (
                  <div key={user.userId} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{user.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.lastAccessed && (
                        <span className="text-xs text-muted-foreground">
                          Last accessed: {formatDate(user.lastAccessed)}
                        </span>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (showShareDialog) {
                            handleRevokeAccess(showShareDialog, user.userId);
                          }
                        }}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(null)}>Cancel</Button>
            <Button 
              disabled={selectedTeamMembers.length === 0}
              onClick={handleConfirmShare}
            >
              Share with {selectedTeamMembers.length} {selectedTeamMembers.length === 1 ? 'member' : 'members'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}