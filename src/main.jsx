import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AnalysisProvider } from "./context/analysisContext";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import LandingPage from "./pages/LandingPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ResultsPage from "./pages/ResultsPage";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />
      },
      {
        path: "practice",
        element: <ResultsPage />
      },
      {
        path: "assessments",
        element: <HistoryPage />
      },
      {
        path: "resources",
        element: (
          <PlaceholderPage
            title="Resources"
            description="Explore curated preparation material for placement success."
          />
        )
      },
      {
        path: "profile",
        element: (
          <PlaceholderPage
            title="Profile"
            description="Manage your account details and personalized prep goals."
          />
        )
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AnalysisProvider>
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </AnalysisProvider>
  </React.StrictMode>
);
