import { createContext, useState, useContext, useCallback, useEffect, ReactNode } from "react";

interface OnboardingState {
  isOpen: boolean;
  onboardingCompleted: boolean;
  currentStep: number;
  totalSteps: number;
  lastInteraction: string | null;
}

interface OnboardingContextType extends OnboardingState {
  setIsOpen: (isOpen: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setCurrentStep: (step: number) => void;
  updateLastInteraction: (feature: string) => void;
}

const defaultState: OnboardingState = {
  isOpen: false,
  onboardingCompleted: false,
  currentStep: 0,
  totalSteps: 8,
  lastInteraction: null
};

export const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage if available
  const savedState = typeof window !== "undefined" ? localStorage.getItem("dmphq_onboarding") : null;
  const initialState: OnboardingState = savedState 
    ? { ...defaultState, ...JSON.parse(savedState) } 
    : defaultState;
  
  const [isOpen, setIsOpenState] = useState<boolean>(initialState.isOpen);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(initialState.onboardingCompleted);
  const [currentStep, setCurrentStep] = useState<number>(initialState.currentStep);
  const [lastInteraction, setLastInteraction] = useState<string | null>(initialState.lastInteraction);
  
  // Auto-save state changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stateToSave = {
        isOpen,
        onboardingCompleted,
        currentStep,
        totalSteps: defaultState.totalSteps,
        lastInteraction
      };
      localStorage.setItem("dmphq_onboarding", JSON.stringify(stateToSave));
    }
  }, [isOpen, onboardingCompleted, currentStep, lastInteraction]);
  
  // Show onboarding for new users after a delay
  useEffect(() => {
    if (!onboardingCompleted && !isOpen) {
      const timer = setTimeout(() => {
        setIsOpenState(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [onboardingCompleted, isOpen]);
  
  // Track if user has completed initial onboarding
  const completeOnboarding = useCallback(() => {
    setOnboardingCompleted(true);
  }, []);
  
  // Allow resetting the onboarding state
  const resetOnboarding = useCallback(() => {
    setCurrentStep(0);
    setOnboardingCompleted(false);
    setLastInteraction(null);
  }, []);
  
  // Control visibility of onboarding UI
  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
  }, []);
  
  // Track last user interaction with features
  const updateLastInteraction = useCallback((feature: string) => {
    setLastInteraction(feature);
  }, []);
  
  const value = {
    isOpen,
    onboardingCompleted,
    currentStep,
    totalSteps: defaultState.totalSteps,
    lastInteraction,
    setIsOpen,
    completeOnboarding,
    resetOnboarding,
    setCurrentStep,
    updateLastInteraction
  };
  
  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  
  return context;
};