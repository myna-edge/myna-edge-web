import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { GuidePage } from "./pages/GuidePage";
import { IssuePage } from "./pages/IssuePage";
import { IssuesPage } from "./pages/IssuesPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WebhookPage } from "./pages/WebhookPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/webhook" element={<WebhookPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/issues/:id" element={<IssuePage />} />
      </Route>
    </Routes>
  );
}
