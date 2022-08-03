import React from "react";

export const themes = {
  default: "default",
  bark: "bark",
  sage: "sage",
  olive: "olive",
  viridian: "viridian",
  prussian_green: "prussian_green",
  blue: "blue",
  purple: "purple",
  magenta: "magenta",
  red: "red",
};

const ThemeContext = React.createContext(themes.default);

export default ThemeContext;
