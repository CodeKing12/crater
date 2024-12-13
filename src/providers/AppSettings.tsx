import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface AppSettingsContextType {
  theme: string;
  language: string;
  setTheme: (theme: string) => void;
  setLanguage: (language: string) => void;
}

// Create the context
const AppSettingsContext = createContext<AppSettingsContextType | undefined>(
  undefined,
);

// Provider component
export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  return (
    <AppSettingsContext.Provider
      value={{ theme, language, setTheme, setLanguage }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

// Hook for consuming the context
export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error(
      "useAppSettings must be used within an AppSettingsProvider",
    );
  }
  return context;
};
