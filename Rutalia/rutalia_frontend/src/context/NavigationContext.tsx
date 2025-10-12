import React, { createContext, useContext, useState, ReactNode } from 'react';

type Coordinate = [number, number];

export interface Milestone {
  id: string;
  title: string;
  coordinates: Coordinate;
}

export interface NavigationContextType {
  activeRouteId: string | null;
  setActiveRouteId: (id: string | null) => void;
  currentMilestone: Milestone | null;
  setCurrentMilestone: (milestone: Milestone | null) => void;
  trackingEnabled: boolean;
  setTrackingEnabled: (enabled: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState<boolean>(false);

  return (
    <NavigationContext.Provider
      value={{
        activeRouteId,
        setActiveRouteId,
        currentMilestone,
        setCurrentMilestone,
        trackingEnabled,
        setTrackingEnabled
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};
