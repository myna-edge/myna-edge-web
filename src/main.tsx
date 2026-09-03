import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ConnectionProvider } from "./connection/ConnectionProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import { ToastViewport } from "./toast";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ConnectionProvider>
        <BrowserRouter>
          <App />
          <ToastViewport />
        </BrowserRouter>
      </ConnectionProvider>
    </ThemeProvider>
  </StrictMode>,
);
