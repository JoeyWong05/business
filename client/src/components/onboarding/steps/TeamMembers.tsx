import React, { useState } from 'react';
import { useOnboarding } from '../OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const inviteSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  role: z.string().min(1, { message: 'Please select a role' }),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export const TeamMembers: React.FC = () => {
  const { onboardingState, addTeamInvite, removeTeamInvite } = useOnboarding();
  const [formVisible, setFormVisible] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: '',
    },
  });

  const onSubmit = (values: InviteFormValues) => {
    addTeamInvite(values.email, values.role);
    form.reset();
    setFormVisible(false);
  };

  // Initialize with role descriptions
  const roleDescriptions: Record<string, string> = {
    'admin': 'Full access to all system features and settings.',
    'manager': 'Can manage most aspects but cannot change system settings.',
    'team_member': 'Can use features but cannot modify settings.',
    'viewer': 'Read-only access to dashboards and reports.',
  };

  // Get initials for avatar
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  // Get role badge color
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      case 'team_member':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-muted-foreground">
          Invite team members to collaborate with you on DMPHQ. You can add more people later.
        </p>
      </div>

      {/* Current team members (invites) */}
      <div className="space-y-4">
        {onboardingState.teamInvites.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {onboardingState.teamInvites.map((invite) => (
              <Card key={invite.email} className="border">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 bg-muted">
                      <AvatarFallback>{getInitials(invite.email)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{invite.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getRoleBadgeClass(invite.role)}>
                          {invite.role.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTeamInvite(invite.email)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/10">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium">No team members yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Invite team members to collaborate with you on your workspace.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add team member form */}
      {formVisible ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border rounded-lg p-4 bg-muted/10">
            <h3 className="font-medium text-lg">Invite Team Member</h3>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="colleague@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="team_member">Team Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('role') && (
              <div className="text-sm bg-muted/20 p-2 rounded">
                <span className="font-medium">Role description: </span>
                {roleDescriptions[form.watch('role')]}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormVisible(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Check className="h-4 w-4 mr-1" />
                Add Team Member
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button 
          onClick={() => setFormVisible(true)} 
          className="w-full"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Invite Team Member
        </Button>
      )}

      <div className="bg-muted/30 p-4 rounded-lg border mt-6">
        <h4 className="font-medium">Why invite your team?</h4>
        <p className="text-sm text-muted-foreground">
          Adding team members helps you delegate tasks, collaborate on projects, and share information.
          Each role has specific permissions to help you maintain control over your workspace.
        </p>
      </div>
    </div>
  );
};