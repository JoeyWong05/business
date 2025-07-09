import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, UserCog, UserPlus, Users, Shield, 
  BriefcaseBusiness, Building, Eye, Book
} from 'lucide-react';

// User Profile Types 
type ProfileType = 
  | 'owner'
  | 'executive'
  | 'manager'
  | 'specialist'
  | 'viewer'
  | 'custom';

interface ProfileConfig {
  id: ProfileType;
  name: string;
  description: string;
  icon: React.ReactNode;
  permissions: string[];
}

// Profile configurations
const profileConfigs: ProfileConfig[] = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to all settings, data, and administration',
    icon: <Shield className="h-5 w-5" />,
    permissions: ['View All', 'Edit All', 'Admin Access', 'Billing Access']
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'High-level analytics and decision-making focus',
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    permissions: ['View All', 'Edit Strategy', 'Performance Metrics', 'Resource Allocation']
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Team-focused view with operational controls',
    icon: <UserCog className="h-5 w-5" />,
    permissions: ['View Department', 'Edit Team Tasks', 'Resource Management', 'Approval Workflows']
  },
  {
    id: 'specialist',
    name: 'Specialist',
    description: 'Domain-specific functionality and tools',
    icon: <User className="h-5 w-5" />,
    permissions: ['View Assigned', 'Edit Assigned', 'Tool Access', 'Collaboration']
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to reports and dashboards',
    icon: <Eye className="h-5 w-5" />,
    permissions: ['View Only', 'Export Reports', 'Comment', 'No Edit Access']
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Tailored permissions and interface',
    icon: <UserPlus className="h-5 w-5" />,
    permissions: ['Customizable', 'Role-Based Permissions', 'Granular Controls']
  }
];

interface ProfileSwitcherProps {
  className?: string;
  onChange?: (profile: ProfileType) => void;
}

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ 
  className = '',
  onChange
}) => {
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>('manager');
  
  const handleProfileChange = (value: ProfileType) => {
    setSelectedProfile(value);
    if (onChange) {
      onChange(value);
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <RadioGroup 
        value={selectedProfile}
        onValueChange={(value) => handleProfileChange(value as ProfileType)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {profileConfigs.map(profile => (
          <div key={profile.id} className="relative">
            <RadioGroupItem
              value={profile.id}
              id={`profile-${profile.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`profile-${profile.id}`}
              className="flex flex-col h-full p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                  {profile.icon}
                </div>
                <div className="font-medium">{profile.name}</div>
              </div>
              <p className="text-sm text-muted-foreground">
                {profile.description}
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <ul className="text-xs text-muted-foreground space-y-1">
                  {profile.permissions.map((perm, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ProfileSwitcher;