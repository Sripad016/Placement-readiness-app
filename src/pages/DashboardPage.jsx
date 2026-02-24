import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { useAnalysis } from "../context/analysisContext";

const sampleJd = `We are hiring a Software Engineer Intern with strong DSA and OOP fundamentals.
You should be comfortable with React, Node.js, Express, REST APIs, SQL, and MongoDB.
Knowledge of AWS, Docker, Linux, and CI/CD is preferred. Experience with PyTest or JUnit is a plus.
You will collaborate across teams and participate in coding rounds and technical interviews.`;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { analyze, currentEntry, history } = useAnalysis();
  const [company, setCompany] = React.useState("");
  const [role, setRole] = React.useState("");
  const [jdText, setJdText] = React.useState("");

  const handleAnalyze = (event) => {
    event.preventDefault();
    analyze({ company, role, jdText });
    navigate("/practice");
  };

  return (
    <section className="analysis-shell">
      <Card>
        <CardHeader>
          <CardTitle>JD Analysis Workspace</CardTitle>
          <CardDescription>
            Paste a job description to extract skills, generate a prep checklist, 7-day plan,
            likely interview questions, and a readiness score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="analysis-form" onSubmit={handleAnalyze}>
            <label className="analysis-field">
              <span>Company</span>
              <input
                type="text"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Example: Acme Technologies"
              />
            </label>

            <label className="analysis-field">
              <span>Role</span>
              <input
                type="text"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Example: Software Engineer Intern"
              />
            </label>

            <label className="analysis-field">
              <span>Job Description</span>
              <textarea
                value={jdText}
                onChange={(event) => setJdText(event.target.value)}
                placeholder="Paste complete JD text here for skill extraction..."
                rows={14}
              />
            </label>

            <div className="analysis-actions">
              <button className="dashboard-btn" type="submit">
                Analyze JD
              </button>
              <button
                className="secondary-btn"
                type="button"
                onClick={() => {
                  setCompany("Acme Technologies");
                  setRole("Software Engineer Intern");
                  setJdText(sampleJd);
                }}
              >
                Load Sample JD
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="status-grid">
            <div className="status-tile">
              <span className="status-label">Saved Analyses</span>
              <strong>{history.length}</strong>
            </div>
            <div className="status-tile">
              <span className="status-label">Latest Score</span>
              <strong>{currentEntry ? `${currentEntry.readinessScore}/100` : "N/A"}</strong>
            </div>
            <div className="status-tile">
              <span className="status-label">Latest Company</span>
              <strong>{currentEntry?.company || "N/A"}</strong>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
