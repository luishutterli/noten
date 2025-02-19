import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthForms from "./components/AuthForm";
import SubjectAdminDashboard from "./components/SubjectAdminDashboard";
import InitSubscription from "./InitSubscription";
import Onboarding from "./Onboading";
import PrivacyPolicy from "./PrivacyPolicy";
import Impressum from "./Impressum";
import SettingsPage from "./SettingsPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<AuthForms />} />
        <Route path="/subscription" element={<InitSubscription />} />
        <Route path="/onboarding" element={ <Onboarding />} />
        <Route path="/settings" element={ <SettingsPage />} />
        <Route path="/privacy" element= { <PrivacyPolicy />} />
        <Route path="/impressum" element={ <Impressum />} />
        <Route path="/sAdmin" element={<SubjectAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
