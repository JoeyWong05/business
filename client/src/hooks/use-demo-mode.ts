import { useContext } from 'react';
import { DemoModeContext } from '@/contexts/DemoModeContext';

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}