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
  id: string; // built-in ke liye PrdCategoryId, custom ke liye user-defined slug
  label: string;
  description: string;
  sections: PrdSection[];
  custom: boolean; // true = DB se aaya, user edit/delete kar sakta hai
};

export const PRD_TEMPLATES: PrdTemplate[] = [
  {
    id: "new-feature",
    custom: false,
    label: "New Feature",
    description: "Net-new capability jo pehle product mein exist nahi karti.",
    sections: [
      { id: "context", title: "Problem & Context", prompt: "Problem kya hai, kiska hai, ab kyun — evidence ke saath. Solution yahan nahi.", required: true },
      { id: "appetite", title: "Appetite", prompt: "Time budget, estimate nahi — e.g. '1 week'. Scope ko cap karta hai.", required: true },
      { id: "goal", title: "Goal & Success Metric", prompt: "User goal + business goal — 1-3 metrics jo success define karein.", required: true },
      { id: "audience", title: "Target Users", prompt: "Main persona + top use case. Obvious ho to skip karo.", required: false },
      { id: "scope", title: "Scope", prompt: "In scope / out of scope (non-goals) — jo jaan-boojh kar nahi banayenge.", required: true },
      { id: "requirements", title: "Requirements", prompt: "Kya true hona chahiye — short testable bullets. Boundary batao, implementation prescribe mat karo.", required: true },
      { id: "edge-cases", title: "Edge Cases & Error States", prompt: "Kya galat ho sakta hai, empty/error states.", required: false },
      { id: "design", title: "Design / UX", prompt: "Figma ya mock links, key flows.", required: false },
      { id: "risks", title: "Risks & Open Questions", prompt: "Rabbit holes (tricky parts), dependencies, jo decide nahi hua — TBD likho, hide mat karo.", required: false },
      { id: "rollout", title: "Rollout Plan", prompt: "Flag? Phased? Kaun owns, 'done/launched' ka matlab kya hai.", required: true },
    ],
  },
  {
    id: "enhancement",
    custom: false,
    label: "Enhancement",
    description: "Existing feature ko improve karna — naya feature nahi.",
    sections: [
      { id: "current", title: "Current Behavior", prompt: "Aaj feature kaise kaam karta hai.", required: true },
      { id: "gap", title: "Problem / Gap", prompt: "Current behavior mein kya kami hai — evidence ke saath.", required: true },
      { id: "appetite", title: "Appetite", prompt: "Time budget, estimate nahi — scope ko cap karta hai.", required: true },
      { id: "change", title: "Proposed Change", prompt: "Exactly kya badalna hai — boundary batao, implementation detail nahi.", required: true },
      { id: "scope", title: "Scope", prompt: "In scope / out of scope (non-goals).", required: true },
      { id: "metric", title: "Success Metric", prompt: "Improvement kaise measure hoga.", required: true },
      { id: "compat", title: "Risk & Backward Compatibility", prompt: "Breaking changes, migration pain, tricky parts (rabbit holes).", required: false },
      { id: "rollout", title: "Rollout Plan", prompt: "Flag? Phased? Kaun owns.", required: true },
      { id: "open-questions", title: "Open Questions", prompt: "Jo abhi decide nahi hua.", required: false },
    ],
  },
  {
    id: "bug-fix",
    custom: false,
    label: "Bug Fix / Tech Debt",
    description: "Kuch toota hua fix karna, ya purana debt saaf karna.",
    sections: [
      { id: "problem", title: "Problem Statement", prompt: "Symptom + root cause (agar pata hai).", required: true },
      { id: "impact", title: "Impact", prompt: "Kitne users affected, severity kya hai.", required: true },
      { id: "fix", title: "Proposed Fix", prompt: "Approach — kya badlega, jo already diagnose hai wahi likho.", required: true },
      { id: "scope", title: "Scope", prompt: "Sirf fix — scope creep avoid karo.", required: true },
      { id: "appetite", title: "Appetite", prompt: "Bada tech-debt payoff ho to time budget batao, chhota fix ho to skip.", required: false },
      { id: "risk", title: "Risk & Rabbit Holes", prompt: "Regression kahan ho sakta hai, tricky parts kaun si hain.", required: false },
      { id: "validation", title: "Validation Plan", prompt: "Fix confirm kaise hoga — test/metric.", required: true },
      { id: "rollout", title: "Rollout Plan", prompt: "Hotfix ya normal release cycle.", required: false },
    ],
  },
  {
    id: "deprecation",
    custom: false,
    label: "Deprecation / Removal",
    description: "Kisi feature/API ko hatana ya band karna.",
    sections: [
      { id: "what", title: "What & Why", prompt: "Kya deprecate ho raha hai, kyun.", required: true },
      { id: "affected", title: "Who / What Is Affected", prompt: "Usage data, affected users/teams.", required: true },
      { id: "migration", title: "Replacement & Migration Path", prompt: "Alternative kya hai, migrate kaise karein.", required: true },
      { id: "timeline", title: "Timeline", prompt: "Announce → deprecate → sunset dates.", required: true },
      { id: "risk", title: "Risk & Rollback", prompt: "Agar wapas chalu karna pade, aur kya tricky hai.", required: false },
      { id: "comms", title: "Comms Plan", prompt: "Kisko batana hai, kab, kaise.", required: true },
    ],
  },
  {
    id: "experiment",
    custom: false,
    label: "Experiment / Spike",
    description: "Hypothesis test karna ya technical spike — abhi ship nahi.",
    sections: [
      { id: "hypothesis", title: "Hypothesis", prompt: "Hum kya believe karte hain, aur kyun.", required: true },
      { id: "test", title: "What We're Testing", prompt: "Exact variants/approach jo test hoga.", required: true },
      { id: "success", title: "Success Criteria", prompt: "Metric + threshold jo decide karega.", required: true },
      { id: "scope", title: "Scope & Duration", prompt: "Sample size, kitne din/weeks — yahi iska appetite hai.", required: true },
      { id: "decision", title: "Decision Criteria", prompt: "Ship / iterate / kill — threshold pehle se decide karo (no-go bhi).", required: true },
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
