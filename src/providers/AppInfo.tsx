import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";

export type PanelFocusSetter = Dispatch<SetStateAction<string>>;

// Define the shape of the context
interface AppInfoContextType {
  user: { id: string; name: string } | null;
  panelFocus: string;
  setUser: (user: { id: string; name: string } | null) => void;
  setPanelFocus: PanelFocusSetter;
}

// Create the context
const AppInfoContext = createContext<AppInfoContextType | undefined>(undefined);

// Provider component
export const AppInfoProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [panelFocus, setPanelFocus] = useState("scripture");

  useEffect(() => {
    console.log(panelFocus);
  }, [panelFocus]);

  return (
    <AppInfoContext.Provider
      value={{ user, panelFocus, setUser, setPanelFocus }}
    >
      {children}
    </AppInfoContext.Provider>
  );
};

// Hook for consuming the context
export const useAppInfo = (): AppInfoContextType => {
  const context = useContext(AppInfoContext);
  if (!context) {
    throw new Error("useAppInfo must be used within an AppInfoProvider");
  }
  return context;
};
