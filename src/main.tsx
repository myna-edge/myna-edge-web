import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ConnectionProvider } from "./connection/ConnectionProvider";
import { queryClient } from "./query/client";
import { ThemeProvider } from "./theme/ThemeProvider";
import { ToastViewport } from "./toast";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ConnectionProvider>
          <BrowserRouter>
            <App />
            <ToastViewport />
          </BrowserRouter>
        </ConnectionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
