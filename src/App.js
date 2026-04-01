import React from "react";
import "./App.css";
import Main from "./containers/Main";
import { ThemeProvider } from "styled-components";
import { chosenTheme } from "./theme";
import { GlobalStyles } from "./global";
import CommandPalette from "./components/CommandPalette/CommandPalette";

function App() {
  const [theme, setTheme] = React.useState(chosenTheme);

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyles />
        <div>
          <CommandPalette theme={theme} setTheme={setTheme} />
          <Main theme={theme} />
        </div>
      </>
    </ThemeProvider>
  );
}

export default App;
