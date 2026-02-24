const CATEGORY_CONFIG = {
  "Core CS": {
    DSA: [/\bdsa\b/i, /\bdata structures?\b/i, /\balgorithms?\b/i],
    OOP: [/\boop\b/i, /\boops\b/i, /\bobject[-\s]?oriented( programming)?\b/i],
    DBMS: [/\bdbms\b/i, /\bdatabase management\b/i],
    OS: [/\bos\b/i, /\boperating systems?\b/i],
    Networks: [/\bnetworks?\b/i, /\bcomputer networks?\b/i]
  },
  Languages: {
    Java: [/\bjava\b(?!script)/i],
    Python: [/\bpython\b/i],
    JavaScript: [/\bjavascript\b/i],
    TypeScript: [/\btypescript\b/i],
    C: [/\bc\b(?=\s*(language|programming|developer))/i],
    "C++": [/\bc\+\+\b/i],
    "C#": [/\bc#\b/i, /\bcsharp\b/i],
    Go: [/\bgolang\b/i, /\bgo language\b/i, /\bgo\b(?=\s*(developer|programming|microservices|backend))/i]
  },
  Web: {
    React: [/\breact(\.js)?\b/i],
    "Next.js": [/\bnext(\.js)?\b/i],
    "Node.js": [/\bnode(\.js)?\b/i, /\bnodejs\b/i],
    Express: [/\bexpress(\.js)?\b/i],
    REST: [/\brest(ful)?\b/i],
    GraphQL: [/\bgraphql\b/i]
  },
  Data: {
    SQL: [/\bsql\b/i],
    MongoDB: [/\bmongodb\b/i],
    PostgreSQL: [/\bpostgres(ql)?\b/i],
    MySQL: [/\bmysql\b/i],
    Redis: [/\bredis\b/i]
  },
  "Cloud/DevOps": {
    AWS: [/\baws\b/i, /\bamazon web services\b/i],
    Azure: [/\bazure\b/i],
    GCP: [/\bgcp\b/i, /\bgoogle cloud\b/i],
    Docker: [/\bdocker\b/i],
    Kubernetes: [/\bkubernetes\b/i, /\bk8s\b/i],
    "CI/CD": [/\bci\/cd\b/i, /\bcontinuous integration\b/i, /\bcontinuous delivery\b/i],
    Linux: [/\blinux\b/i]
  },
  Testing: {
    Selenium: [/\bselenium\b/i],
    Cypress: [/\bcypress\b/i],
    Playwright: [/\bplaywright\b/i],
    JUnit: [/\bjunit\b/i],
    PyTest: [/\bpytest\b/i]
  }
};

const roundTemplate = {
  round1: [
    "Revise percentages, probability, and logical reasoning.",
    "Practice 20 aptitude MCQs with time tracking.",
    "Review language fundamentals and syntax basics.",
    "Refresh OS, DBMS, and networking concepts at interview depth.",
    "Prepare concise explanations for your strongest technical areas."
  ],
  round2: [
    "Solve 4 medium DSA problems with dry-run explanation.",
    "Revise arrays, strings, linked lists, and trees.",
    "Prepare complexity analysis (time/space) for common approaches.",
    "Review core CS interview questions for OS, DBMS, and networks.",
    "Practice writing clean code within 30-40 minute constraints."
  ],
  round3: [
    "Map one major project to the target role requirements.",
    "Prepare architecture and trade-off explanations for your project.",
    "Review stack-specific implementation details and APIs.",
    "Align resume bullets to measurable outcomes and impact.",
    "Practice answering 'why this technology' and 'what would you improve'."
  ],
  round4: [
    "Prepare a 60-second personal introduction.",
    "Draft STAR responses for teamwork and conflict examples.",
    "Clarify role motivation and company alignment points.",
    "Prepare HR responses around strengths, weaknesses, and goals.",
    "Finalize questions to ask interviewer about team and expectations."
  ]
};

const questionBank = {
  DSA: [
    "How would you optimize search in sorted data?",
    "When would you choose binary search over hashing?"
  ],
  OOP: ["How do abstraction and encapsulation improve maintainability?"],
  DBMS: ["What is normalization and when would you denormalize?"],
  OS: ["Explain process vs thread and practical scheduling impact."],
  Networks: ["How does TCP differ from UDP for interview-relevant scenarios?"],
  Java: ["How does JVM memory management impact application behavior?"],
  Python: ["When do you prefer list comprehension vs generator expression?"],
  JavaScript: ["How do closures and scope impact asynchronous code?"],
  TypeScript: ["How do interfaces and generics improve large codebases?"],
  C: ["What are pointer pitfalls and how do you avoid memory issues in C?"],
  "C++": ["How would you explain RAII and smart pointers in C++?"],
  "C#": ["How does async/await work in C# and when can it fail?"],
  Go: ["How do goroutines and channels help in concurrent workflows?"],
  React: ["Explain state management options in React and when to use each."],
  "Next.js": ["When do you choose server rendering vs static generation in Next.js?"],
  "Node.js": ["How does Node.js event loop handle concurrency?"],
  Express: ["How do you structure Express middleware for authentication and errors?"],
  REST: ["How would you design versioned REST APIs for backward compatibility?"],
  GraphQL: ["What are GraphQL resolver bottlenecks and how do you avoid them?"],
  SQL: ["Explain indexing and when it helps."],
  MongoDB: ["When is MongoDB schema flexibility beneficial, and when is it risky?"],
  PostgreSQL: ["When would you choose PostgreSQL features over MySQL alternatives?"],
  MySQL: ["How do you diagnose and optimize a slow MySQL query?"],
  Redis: ["When should Redis be used as cache vs primary store?"],
  AWS: ["Which AWS services would you pick for a scalable web app and why?"],
  Azure: ["How would you map a typical deployment pipeline on Azure?"],
  GCP: ["How would you deploy and monitor a service on GCP?"],
  Docker: ["How do you optimize Docker images for faster CI builds?"],
  Kubernetes: ["What problem does Kubernetes solve beyond plain containers?"],
  "CI/CD": ["How would you structure CI/CD checks before production release?"],
  Linux: ["Which Linux commands do you use most for debugging deployments?"],
  Selenium: ["How do you reduce flaky tests in Selenium suites?"],
  Cypress: ["When is Cypress ideal compared with Selenium or Playwright?"],
  Playwright: ["How do you design stable Playwright selectors for dynamic UIs?"],
  JUnit: ["How do you organize JUnit tests for maintainable coverage?"],
  PyTest: ["How do fixtures and parametrization improve PyTest suites?"]
};

const unique = (items) => [...new Set(items)];
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const VALID_CONFIDENCE = new Set(["know", "practice"]);

function flattenExtractedSkills(extractedSkills) {
  return unique(Object.values(extractedSkills || {}).flat());
}

function buildDefaultSkillConfidenceMap(extractedSkills) {
  const skills = flattenExtractedSkills(extractedSkills);
  return skills.reduce((acc, skill) => {
    acc[skill] = "practice";
    return acc;
  }, {});
}

function normalizeSkillConfidenceMap(extractedSkills, skillConfidenceMap) {
  const defaults = buildDefaultSkillConfidenceMap(extractedSkills);
  const current = skillConfidenceMap || {};
  const normalized = { ...defaults };

  Object.keys(defaults).forEach((skill) => {
    const value = current[skill];
    if (VALID_CONFIDENCE.has(value)) {
      normalized[skill] = value;
    }
  });

  return normalized;
}

function computeLiveReadinessScore(baseReadinessScore, skillConfidenceMap) {
  const base = typeof baseReadinessScore === "number" ? baseReadinessScore : 35;
  const confidenceValues = Object.values(skillConfidenceMap || {});
  const knowCount = confidenceValues.filter((value) => value === "know").length;
  const practiceCount = confidenceValues.filter((value) => value === "practice").length;
  return clamp(base + knowCount * 2 - practiceCount * 2, 0, 100);
}

function detectSkills(jdText) {
  const text = jdText || "";
  const extracted = {};

  Object.entries(CATEGORY_CONFIG).forEach(([category, skills]) => {
    const foundSkills = [];

    Object.entries(skills).forEach(([skill, patterns]) => {
      if (patterns.some((pattern) => pattern.test(text))) {
        foundSkills.push(skill);
      }
    });

    if (foundSkills.length > 0) {
      extracted[category] = foundSkills;
    }
  });

  if (Object.keys(extracted).length === 0) {
    extracted.General = ["General fresher stack"];
  }

  return extracted;
}

function createChecklist(extractedSkills) {
  const allSkills = Object.values(extractedSkills).flat();
  const has = (skill) => allSkills.includes(skill);
  const checklist = {
    "Round 1: Aptitude / Basics": [...roundTemplate.round1],
    "Round 2: DSA + Core CS": [...roundTemplate.round2],
    "Round 3: Tech interview (projects + stack)": [...roundTemplate.round3],
    "Round 4: Managerial / HR": [...roundTemplate.round4]
  };

  if (has("Java") || has("Python") || has("JavaScript") || has("TypeScript")) {
    checklist["Round 1: Aptitude / Basics"].push(
      "Practice language-focused MCQs for your primary coding language."
    );
  }
  if (has("DSA")) {
    checklist["Round 2: DSA + Core CS"].push(
      "Do one timed DSA mock round with verbal explanation."
    );
  }
  if (has("React") || has("Next.js")) {
    checklist["Round 3: Tech interview (projects + stack)"].push(
      "Prepare component architecture and state-flow explanation for your frontend."
    );
  }
  if (has("Node.js") || has("Express") || has("REST") || has("GraphQL")) {
    checklist["Round 3: Tech interview (projects + stack)"].push(
      "Prepare backend API design, validation, and error-handling answers."
    );
  }
  if (has("SQL") || has("MongoDB") || has("PostgreSQL") || has("MySQL") || has("Redis")) {
    checklist["Round 3: Tech interview (projects + stack)"].push(
      "Review schema design, indexing, and query optimization from your projects."
    );
  }
  if (has("Docker") || has("Kubernetes") || has("AWS") || has("Azure") || has("GCP")) {
    checklist["Round 3: Tech interview (projects + stack)"].push(
      "Prepare deployment pipeline and environment troubleshooting stories."
    );
  }
  if (has("Selenium") || has("Cypress") || has("Playwright") || has("JUnit") || has("PyTest")) {
    checklist["Round 3: Tech interview (projects + stack)"].push(
      "Prepare test strategy explanation including flaky test mitigation."
    );
  }

  Object.keys(checklist).forEach((round) => {
    const deduped = unique(checklist[round]);
    checklist[round] = deduped.slice(0, 8);
    while (checklist[round].length < 5) {
      checklist[round].push("Practice concise explanation and time-managed response.");
    }
  });

  return checklist;
}

function createSevenDayPlan(extractedSkills) {
  const allSkills = Object.values(extractedSkills).flat();
  const has = (skill) => allSkills.includes(skill);

  const day1 = ["Language fundamentals revision", "Core CS snapshot: OS + DBMS"];
  const day2 = ["Core CS snapshot: Networks + OOP", "Aptitude timed practice set"];
  const day3 = ["DSA patterns: arrays, strings, hashing", "2 timed coding questions"];
  const day4 = ["DSA patterns: trees, graphs, DP", "Complexity-first solution review"];
  const day5 = ["Project + resume alignment", "Quantify impact in key resume bullets"];
  const day6 = ["Mock interview questions rehearsal", "Explain decisions and trade-offs"];
  const day7 = ["Revision + weak areas", "Final confidence checklist"];

  if (has("React") || has("Next.js")) {
    day5.push("Frontend revision: component architecture and state flow.");
  }
  if (has("Node.js") || has("Express")) {
    day5.push("Backend revision: API design and middleware strategy.");
  }
  if (has("SQL") || has("PostgreSQL") || has("MySQL")) {
    day5.push("Database revision: joins, indexing, and query tuning.");
  }
  if (has("MongoDB") || has("Redis")) {
    day5.push("Data layer revision: schema decisions and caching strategy.");
  }
  if (has("AWS") || has("Azure") || has("GCP") || has("Docker") || has("Kubernetes")) {
    day6.push("Cloud/DevOps review: deployment flow and production troubleshooting.");
  }
  if (has("Selenium") || has("Cypress") || has("Playwright") || has("JUnit") || has("PyTest")) {
    day6.push("Testing revision: unit/e2e strategy and flaky-test prevention.");
  }

  return {
    "Day 1": day1,
    "Day 2": day2,
    "Day 3": day3,
    "Day 4": day4,
    "Day 5": day5,
    "Day 6": day6,
    "Day 7": day7
  };
}

function createQuestions(extractedSkills) {
  const allSkills = unique(Object.values(extractedSkills).flat());
  const questions = [];

  allSkills.forEach((skill) => {
    if (questionBank[skill]) {
      questions.push(...questionBank[skill]);
    }
  });

  const fallback = [
    "How do you prioritize features when deadlines are tight?",
    "How do you debug a bug that appears only in production?",
    "How would you explain your strongest project to a non-technical interviewer?",
    "What trade-offs did you make in your most recent implementation?",
    "How do you ensure code quality under delivery pressure?",
    "How do you break down an unfamiliar problem statement?",
    "How do you validate that your solution actually meets requirements?",
    "How would you improve the architecture of your current project?",
    "How do you collaborate when reviewers disagree with your approach?",
    "What metrics would you track after shipping a feature?"
  ];

  const deduped = unique(questions);
  while (deduped.length < 10) {
    deduped.push(fallback[deduped.length - questions.length] || fallback[0]);
  }

  return deduped.slice(0, 10);
}

function calculateReadinessScore({ categoryCount, company, role, jdText }) {
  let score = 35;
  score += Math.min(categoryCount * 5, 30);
  if ((company || "").trim()) score += 10;
  if ((role || "").trim()) score += 10;
  if ((jdText || "").trim().length > 800) score += 10;
  return clamp(score, 0, 100);
}

function createAnalysis({ company, role, jdText }) {
  const extractedSkills = detectSkills(jdText);
  const detectedCategoryCount = Object.keys(extractedSkills).filter(
    (category) => category !== "General"
  ).length;

  const checklist = createChecklist(extractedSkills);
  const plan = createSevenDayPlan(extractedSkills);
  const questions = createQuestions(extractedSkills);
  const baseReadinessScore = calculateReadinessScore({
    categoryCount: detectedCategoryCount,
    company,
    role,
    jdText
  });
  const skillConfidenceMap = buildDefaultSkillConfidenceMap(extractedSkills);
  const readinessScore = computeLiveReadinessScore(baseReadinessScore, skillConfidenceMap);

  return {
    id: `analysis_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    company: company || "",
    role: role || "",
    jdText: jdText || "",
    extractedSkills,
    plan,
    checklist,
    questions,
    baseReadinessScore,
    skillConfidenceMap,
    readinessScore
  };
}

export {
  CATEGORY_CONFIG,
  createAnalysis,
  detectSkills,
  clamp,
  flattenExtractedSkills,
  buildDefaultSkillConfidenceMap,
  normalizeSkillConfidenceMap,
  computeLiveReadinessScore
};
