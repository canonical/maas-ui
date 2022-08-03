import { createContext } from "react";

export type ThemeContent = {
  theme: string;
  setTheme: (c: string) => void;
};

const ThemeContext = createContext<ThemeContent>({
  theme: "default",
  setTheme: () => {},
});

export default ThemeContext;
