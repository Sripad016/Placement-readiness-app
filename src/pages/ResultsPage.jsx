import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { useAnalysis } from "../context/analysisContext";
import {
  normalizeSkillConfidenceMap,
  computeLiveReadinessScore,
  flattenExtractedSkills
} from "../lib/analysisEngine";

const formatChecklist = (checklist) =>
  Object.entries(checklist)
    .map(([round, items]) => {
      const list = items.map((item, idx) => `${idx + 1}. ${item}`).join("\n");
      return `${round}\n${list}`;
    })
    .join("\n\n");

const formatPlan = (plan) =>
  Object.entries(plan)
    .map(([day, tasks]) => `${day}\n${tasks.map((task, idx) => `${idx + 1}. ${task}`).join("\n")}`)
    .join("\n\n");

const formatQuestions = (questions) => questions.map((q, i) => `${i + 1}. ${q}`).join("\n");

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

function SkillsByCategory({ extractedSkills, skillConfidenceMap, onConfidenceChange }) {
  return (
    <div className="result-section">
      <h3>Key Skills Extracted</h3>
      <div className="skill-groups">
        {Object.entries(extractedSkills).map(([category, skills]) => (
          <div className="skill-group" key={category}>
            <p className="group-title">{category}</p>
            <div className="skill-interactive-list">
              {skills.map((skill) => {
                const current = skillConfidenceMap[skill] || "practice";
                return (
                  <div className="skill-row" key={skill}>
                    <span className="skill-tag">{skill}</span>
                    <div className="confidence-toggle-group">
                      <button
                        type="button"
                        className={`confidence-toggle${current === "know" ? " confidence-toggle-active" : ""}`}
                        onClick={() => onConfidenceChange(skill, "know")}
                      >
                        I know this
                      </button>
                      <button
                        type="button"
                        className={`confidence-toggle${
                          current === "practice" ? " confidence-toggle-active practice" : ""
                        }`}
                        onClick={() => onConfidenceChange(skill, "practice")}
                      >
                        Need practice
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistSection({ checklist }) {
  return (
    <div className="result-section">
      <h3>Round-wise Preparation Checklist</h3>
      <div className="checklist-grid">
        {Object.entries(checklist).map(([round, items]) => (
          <article className="round-card" key={round}>
            <h4>{round}</h4>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function SevenDayPlanSection({ plan }) {
  return (
    <div className="result-section">
      <h3>7-Day Plan</h3>
      <div className="plan-grid">
        {Object.entries(plan).map(([day, tasks]) => (
          <article className="plan-card" key={day}>
            <h4>{day}</h4>
            <ul>
              {tasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function QuestionsSection({ questions }) {
  return (
    <div className="result-section">
      <h3>10 Likely Interview Questions</h3>
      <ol className="questions-list">
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
    </div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { currentEntry, updateSelectedEntry } = useAnalysis();
  const [copyFeedback, setCopyFeedback] = React.useState("");

  if (!currentEntry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>No analysis found yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <button className="dashboard-btn" type="button" onClick={() => navigate("/dashboard")}>
            Analyze a Job Description
          </button>
        </CardContent>
      </Card>
    );
  }

  const timestamp = new Date(currentEntry.createdAt).toLocaleString();
  const safeConfidenceMap = normalizeSkillConfidenceMap(
    currentEntry.extractedSkills,
    currentEntry.skillConfidenceMap
  );
  const liveScore = computeLiveReadinessScore(
    currentEntry.baseReadinessScore ?? currentEntry.readinessScore,
    safeConfidenceMap
  );
  const weakSkills = flattenExtractedSkills(currentEntry.extractedSkills)
    .filter((skill) => safeConfidenceMap[skill] !== "know")
    .slice(0, 3);

  const onConfidenceChange = (skill, value) => {
    updateSelectedEntry((entry) => {
      const nextMap = normalizeSkillConfidenceMap(entry.extractedSkills, entry.skillConfidenceMap);
      nextMap[skill] = value;
      const nextScore = computeLiveReadinessScore(entry.baseReadinessScore, nextMap);
      return {
        ...entry,
        skillConfidenceMap: nextMap,
        readinessScore: nextScore
      };
    });
  };

  const onCopy = async (text, label) => {
    try {
      await copyText(text);
      setCopyFeedback(`${label} copied.`);
    } catch {
      setCopyFeedback("Clipboard permission is unavailable in this browser context.");
    }
  };

  const onDownload = () => {
    const content = [
      `Company: ${currentEntry.company || "Unknown Company"}`,
      `Role: ${currentEntry.role || "Unknown Role"}`,
      `Date: ${timestamp}`,
      `Readiness Score: ${liveScore}/100`,
      "",
      "Key Skills Extracted",
      Object.entries(currentEntry.extractedSkills)
        .map(([category, skills]) => `${category}: ${skills.join(", ")}`)
        .join("\n"),
      "",
      "Round-wise Checklist",
      formatChecklist(currentEntry.checklist),
      "",
      "7-Day Plan",
      formatPlan(currentEntry.plan),
      "",
      "10 Likely Interview Questions",
      formatQuestions(currentEntry.questions)
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(currentEntry.company || "analysis").replace(/\s+/g, "_")}_results.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="results-shell">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            {currentEntry.company || "Unknown Company"} | {currentEntry.role || "Unknown Role"} |{" "}
            {timestamp}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="readiness-banner">
            <span>Readiness Score</span>
            <strong>{liveScore}/100</strong>
          </div>

          <div className="export-actions">
            <button
              type="button"
              className="secondary-btn compact"
              onClick={() => onCopy(formatPlan(currentEntry.plan), "7-day plan")}
            >
              Copy 7-day plan
            </button>
            <button
              type="button"
              className="secondary-btn compact"
              onClick={() => onCopy(formatChecklist(currentEntry.checklist), "Round checklist")}
            >
              Copy round checklist
            </button>
            <button
              type="button"
              className="secondary-btn compact"
              onClick={() => onCopy(formatQuestions(currentEntry.questions), "10 questions")}
            >
              Copy 10 questions
            </button>
            <button type="button" className="secondary-btn compact" onClick={onDownload}>
              Download as TXT
            </button>
          </div>
          <p className="copy-feedback">{copyFeedback}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <SkillsByCategory
            extractedSkills={currentEntry.extractedSkills}
            skillConfidenceMap={safeConfidenceMap}
            onConfidenceChange={onConfidenceChange}
          />
          <ChecklistSection checklist={currentEntry.checklist} />
          <SevenDayPlanSection plan={currentEntry.plan} />
          <QuestionsSection questions={currentEntry.questions} />

          <div className="action-next-box">
            <h3>Action Next</h3>
            <p>Top weak skills</p>
            <div className="skill-tags">
              {(weakSkills.length > 0 ? weakSkills : ["No weak skills marked"]).map((skill) => (
                <span className="skill-tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
            <p className="next-action-text">Start Day 1 plan now.</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
