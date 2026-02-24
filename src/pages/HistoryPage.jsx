import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { useAnalysis } from "../context/analysisContext";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, selectEntry, clearHistory } = useAnalysis();

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>No saved analyses yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <button className="dashboard-btn" type="button" onClick={() => navigate("/dashboard")}>
            Start First Analysis
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="history-shell">
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>
            Saved analyses are persisted in localStorage and available after refresh.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="history-actions">
            <button className="secondary-btn" type="button" onClick={clearHistory}>
              Clear History
            </button>
          </div>
          <ul className="history-list">
            {history.map((entry) => {
              const createdAt = new Date(entry.createdAt).toLocaleString();
              return (
                <li key={entry.id}>
                  <button
                    className="history-item"
                    type="button"
                    onClick={() => {
                      selectEntry(entry.id);
                      navigate("/practice");
                    }}
                  >
                    <div>
                      <strong>{entry.company || "Unknown Company"}</strong>
                      <p>{entry.role || "Unknown Role"}</p>
                    </div>
                    <div className="history-meta">
                      <span>{createdAt}</span>
                      <strong>{entry.readinessScore}/100</strong>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
