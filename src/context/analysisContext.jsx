import React from "react";
import {
  createAnalysis,
  normalizeSkillConfidenceMap,
  computeLiveReadinessScore
} from "../lib/analysisEngine";

const HISTORY_KEY = "placement_readiness_history_v1";
const SELECTED_KEY = "placement_readiness_selected_id_v1";

const AnalysisContext = React.createContext(null);

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeEntry = (entry) => {
  const extractedSkills = entry?.extractedSkills || { General: ["General fresher stack"] };
  const baseReadinessScore =
    typeof entry?.baseReadinessScore === "number"
      ? entry.baseReadinessScore
      : typeof entry?.readinessScore === "number"
      ? entry.readinessScore
      : 35;
  const skillConfidenceMap = normalizeSkillConfidenceMap(
    extractedSkills,
    entry?.skillConfidenceMap
  );
  const readinessScore = computeLiveReadinessScore(baseReadinessScore, skillConfidenceMap);

  return {
    ...entry,
    extractedSkills,
    baseReadinessScore,
    skillConfidenceMap,
    readinessScore
  };
};

function AnalysisProvider({ children }) {
  const [history, setHistory] = React.useState(() => {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = safeParse(raw, []);
    return Array.isArray(parsed) ? parsed.map(normalizeEntry) : [];
  });

  const [selectedEntryId, setSelectedEntryId] = React.useState(
    () => localStorage.getItem(SELECTED_KEY) || null
  );

  React.useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  React.useEffect(() => {
    if (selectedEntryId) {
      localStorage.setItem(SELECTED_KEY, selectedEntryId);
    } else {
      localStorage.removeItem(SELECTED_KEY);
    }
  }, [selectedEntryId]);

  const currentEntry = React.useMemo(() => {
    if (history.length === 0) return null;
    if (selectedEntryId) {
      const selected = history.find((entry) => entry.id === selectedEntryId);
      if (selected) return selected;
    }
    return history[0];
  }, [history, selectedEntryId]);

  const analyze = React.useCallback((input) => {
    const nextEntry = createAnalysis(input);
    setHistory((prev) => [normalizeEntry(nextEntry), ...prev]);
    setSelectedEntryId(nextEntry.id);
    return nextEntry;
  }, []);

  const selectEntry = React.useCallback((entryId) => {
    setSelectedEntryId(entryId);
  }, []);

  const updateEntryById = React.useCallback((entryId, updater) => {
    setHistory((prev) =>
      prev.map((entry) => {
        if (entry.id !== entryId) return entry;
        const nextEntry = typeof updater === "function" ? updater(entry) : { ...entry, ...updater };
        return normalizeEntry(nextEntry);
      })
    );
  }, []);

  const updateSelectedEntry = React.useCallback(
    (updater) => {
      const targetId = selectedEntryId || (history[0] ? history[0].id : null);
      if (!targetId) return;
      updateEntryById(targetId, updater);
    },
    [selectedEntryId, history, updateEntryById]
  );

  const clearHistory = React.useCallback(() => {
    setHistory([]);
    setSelectedEntryId(null);
  }, []);

  const value = React.useMemo(
    () => ({
      history,
      selectedEntryId,
      currentEntry,
      analyze,
      selectEntry,
      updateSelectedEntry,
      clearHistory
    }),
    [
      history,
      selectedEntryId,
      currentEntry,
      analyze,
      selectEntry,
      updateSelectedEntry,
      clearHistory
    ]
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

function useAnalysis() {
  const context = React.useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used inside AnalysisProvider.");
  }
  return context;
}

export { AnalysisProvider, useAnalysis };
