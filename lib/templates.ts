// Single source of truth — web UI aur MCP dono isko use karte hain.

export const PRD_CATEGORY_IDS = [
  "new-feature",
  "enhancement",
  "bug-fix",
  "deprecation",
  "experiment",
] as const;

export type PrdCategoryId = (typeof PRD_CATEGORY_IDS)[number];

export type PrdSection = {
  id: string;
  title: string;
  prompt: string; // short guidance, placeholder jaisa
  required: boolean;
};

export type PrdTemplate = {
  id: PrdCategoryId;
  label: string;
  description: string;
  sections: PrdSection[];
};

export const PRD_TEMPLATES: PrdTemplate[] = [
  {
    id: "new-feature",
    label: "New Feature",
    description: "Net-new capability jo pehle product mein exist nahi karti.",
    sections: [
      { id: "context", title: "Problem & Context", prompt: "Yeh feature kyun aur ab kyun? User/business pain.", required: true },
      { id: "goal", title: "Goal & Success Metric", prompt: "1-3 metrics jo batayein ki feature kaam kar rahi hai.", required: true },
      { id: "scope", title: "Scope", prompt: "In scope kya hai, out of scope kya hai — explicitly.", required: true },
      { id: "requirements", title: "Requirements", prompt: "Functional requirements, bullet list mein.", required: true },
      { id: "edge-cases", title: "Edge Cases & Error States", prompt: "Kya galat ho sakta hai, empty/error states.", required: false },
      { id: "design", title: "Design / UX", prompt: "Figma ya mock links, key flows.", required: false },
      { id: "rollout", title: "Rollout Plan", prompt: "Flag? Phased? Kis order mein, kaun owns.", required: true },
      { id: "open-questions", title: "Open Questions", prompt: "Jo abhi decide nahi hua.", required: false },
    ],
  },
  {
    id: "enhancement",
    label: "Enhancement",
    description: "Existing feature ko improve karna — naya feature nahi.",
    sections: [
      { id: "current", title: "Current Behavior", prompt: "Aaj feature kaise kaam karta hai.", required: true },
      { id: "gap", title: "Problem / Gap", prompt: "Current behavior mein kya kami hai.", required: true },
      { id: "change", title: "Proposed Change", prompt: "Exactly kya badalna hai.", required: true },
      { id: "scope", title: "Scope", prompt: "In scope / out of scope.", required: true },
      { id: "metric", title: "Success Metric", prompt: "Improvement kaise measure hoga.", required: true },
      { id: "compat", title: "Backward Compatibility & Risk", prompt: "Existing users/integrations pe asar.", required: false },
      { id: "rollout", title: "Rollout Plan", prompt: "Flag? Phased? Kaun owns.", required: true },
      { id: "open-questions", title: "Open Questions", prompt: "Jo abhi decide nahi hua.", required: false },
    ],
  },
  {
    id: "bug-fix",
    label: "Bug Fix / Tech Debt",
    description: "Kuch toota hua fix karna, ya purana debt saaf karna.",
    sections: [
      { id: "problem", title: "Problem Statement", prompt: "Symptom + root cause (agar pata hai).", required: true },
      { id: "impact", title: "Impact", prompt: "Kitne users affected, severity kya hai.", required: true },
      { id: "fix", title: "Proposed Fix", prompt: "Approach — kya change hoga.", required: true },
      { id: "scope", title: "Scope", prompt: "Sirf fix — scope creep avoid karo.", required: true },
      { id: "risk", title: "Risk of Fix", prompt: "Regression ka chance kahan hai.", required: false },
      { id: "validation", title: "Validation Plan", prompt: "Fix confirm kaise hoga — test/metric.", required: true },
      { id: "rollout", title: "Rollout Plan", prompt: "Hotfix ya normal release cycle.", required: false },
    ],
  },
  {
    id: "deprecation",
    label: "Deprecation / Removal",
    description: "Kisi feature/API ko hatana ya band karna.",
    sections: [
      { id: "what", title: "What & Why", prompt: "Kya deprecate ho raha hai, kyun.", required: true },
      { id: "affected", title: "Who / What Is Affected", prompt: "Usage data, affected users/teams.", required: true },
      { id: "migration", title: "Replacement & Migration Path", prompt: "Alternative kya hai, migrate kaise karein.", required: true },
      { id: "timeline", title: "Timeline", prompt: "Announce → deprecate → sunset dates.", required: true },
      { id: "risk", title: "Risk & Rollback", prompt: "Agar wapas chalu karna pade.", required: false },
      { id: "comms", title: "Comms Plan", prompt: "Kisko batana hai, kab, kaise.", required: true },
    ],
  },
  {
    id: "experiment",
    label: "Experiment / Spike",
    description: "Hypothesis test karna ya technical spike — abhi ship nahi.",
    sections: [
      { id: "hypothesis", title: "Hypothesis", prompt: "Hum kya believe karte hain, aur kyun.", required: true },
      { id: "test", title: "What We're Testing", prompt: "Exact variants/approach jo test hoga.", required: true },
      { id: "success", title: "Success Criteria", prompt: "Metric + threshold jo decide karega.", required: true },
      { id: "scope", title: "Scope & Duration", prompt: "Sample size, kitne din/weeks.", required: true },
      { id: "decision", title: "Decision Criteria", prompt: "Ship / iterate / kill — kis basis pe.", required: true },
      { id: "risks", title: "Risks", prompt: "Kya galat ho sakta hai experiment mein.", required: false },
    ],
  },
];

export function getTemplate(id: string): PrdTemplate | undefined {
  return PRD_TEMPLATES.find((t) => t.id === id);
}

export function requiredSectionIds(template: PrdTemplate): string[] {
  return template.sections.filter((s) => s.required).map((s) => s.id);
}
