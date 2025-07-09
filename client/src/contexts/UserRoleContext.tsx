import React, { createContext, ReactNode, useContext, useState } from 'react';

type UserRole = 'admin' | 'manager' | 'employee' | 'customer';

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const UserRoleContext = createContext<UserRoleContextType>({
  userRole: 'admin',
  setUserRole: () => {}
});

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>('admin');

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);