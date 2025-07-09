import React, { useState } from "react";
import { useUserRole, TeamMember } from "@/contexts/UserRoleContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import TeamManagement from "./TeamManagement";

export default function TeamManagementDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { userRole } = useUserRole();
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem 
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className="flex items-center py-1.5"
        >
          <Users className="mr-2 h-4 w-4" />
          <span>Team Management</span>
          {userRole === 'admin' && (
            <Badge variant="outline" className="ml-auto text-[10px] py-0 px-1.5 rounded-sm">Admin</Badge>
          )}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Team Management</DialogTitle>
          <DialogDescription>
            Manage your team members, roles, and permissions
          </DialogDescription>
        </DialogHeader>
        <TeamManagement />
      </DialogContent>
    </Dialog>
  );
}