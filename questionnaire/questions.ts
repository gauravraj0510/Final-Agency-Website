export type QuestionType = "text" | "email" | "textarea" | "single-select" | "multi-select";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  section: string;
  title: string;
  helper?: string;
  type: QuestionType;
  placeholder?: string;
  options?: QuestionOption[];
  required?: boolean;
  allowOtherText?: boolean;
}

export const questions: Question[] = [
  {
    id: "name",
    section: "Business profile",
    title: "What is your name?",
    helper: "We’ll use this to personalize your assessment.",
    type: "text",
    placeholder: "Alex Rivera",
    required: true,
  },
  {
    id: "email",
    section: "Business profile",
    title: "What is your work email?",
    helper: "We’ll send your AI operations assessment here.",
    type: "email",
    placeholder: "you@company.com",
    required: true,
  },
  {
    id: "industry",
    section: "Business basics",
    title: "What industry is your business in?",
    helper: "E.g. Healthcare, Real Estate, Ecommerce, Manufacturing, Services.",
    type: "multi-select",
    options: [
      { value: "healthcare", label: "Healthcare" },
      { value: "real-estate", label: "Real Estate" },
      { value: "ecommerce", label: "Ecommerce" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "services", label: "Services" },
    ],
    required: true,
    allowOtherText: true,
  },
  {
    id: "companySize",
    section: "Business basics",
    title: "Company size?",
    type: "multi-select",
    options: [
      { value: "solo", label: "Solo / Founder" },
      { value: "2-10", label: "2–10 employees" },
      { value: "10-50", label: "10–50 employees" },
      { value: "50+", label: "50+ employees" },
    ],
    required: true,
    allowOtherText: true,
  },
  {
    id: "acquisitionChannel",
    section: "Revenue engine",
    title: "How do most of your customers currently find you?",
    type: "multi-select",
    options: [
      { value: "referrals", label: "Referrals" },
      { value: "paid-ads", label: "Paid ads" },
      { value: "social-media", label: "Social media" },
      { value: "outbound-sales", label: "Outbound sales" },
      { value: "marketplaces", label: "Marketplaces" },
    ],
    required: true,
    allowOtherText: true,
  },
  {
    id: "leadFollowup",
    section: "Revenue engine",
    title: "What happens after a lead shows interest?",
    helper: "Select everything that typically happens, then add any extra detail.",
    type: "multi-select",
    options: [
      { value: "manual-calls", label: "Manual calls" },
      { value: "whatsapp-followups", label: "WhatsApp follow-ups" },
      { value: "crm-pipeline", label: "CRM pipeline" },
      { value: "email-automation", label: "Email automation" },
      { value: "no-structured-process", label: "No structured process" },
    ],
    placeholder: "We follow up manually on WhatsApp and update deals in our CRM once a week…",
    required: true,
    allowOtherText: false,
  },
  {
    id: "repetitiveTasks",
    section: "Operations",
    title: "What are the 3 most repetitive tasks your team performs every day?",
    helper: "Select everything that applies, then add any extra detail.",
    type: "multi-select",
    options: [
      { value: "data-entry", label: "Data entry" },
      { value: "customer-support", label: "Customer support replies" },
      { value: "lead-qualification", label: "Lead qualification" },
      { value: "report-generation", label: "Report generation" },
      { value: "inventory-tracking", label: "Inventory / order tracking" },
    ],
    placeholder: "1) Data entry for new leads\n2) Customer support replies\n3) Weekly reporting…",
    required: true,
    allowOtherText: true,
  },
  {
    id: "manualHours",
    section: "Operations",
    title: "How many hours per week are spent on manual administrative work?",
    type: "multi-select",
    options: [
      { value: "<5", label: "<5 hours" },
      { value: "5-20", label: "5–20 hours" },
      { value: "20-50", label: "20–50 hours" },
      { value: "50+", label: "50+ hours" },
    ],
    required: true,
    allowOtherText: true,
  },
  {
    id: "bottleneckProcesses",
    section: "Operations",
    title: "What processes cause the most delays or mistakes?",
    helper: "Select everything that applies, then add any extra detail.",
    type: "multi-select",
    options: [
      { value: "customer-onboarding", label: "Customer onboarding" },
      { value: "order-processing", label: "Order processing / fulfillment" },
      { value: "reporting", label: "Reporting & analytics" },
      { value: "internal-approvals", label: "Internal approvals" },
      { value: "scheduling", label: "Scheduling / calendar coordination" },
    ],
    placeholder: "Customer onboarding often stalls when paperwork is incomplete…",
    required: true,
    allowOtherText: true,
  },
  {
    id: "tools",
    section: "Technology stack",
    title: "Which tools do you currently use?",
    helper: "List CRMs, spreadsheets, ERPs, messaging apps, custom tools, etc.",
    type: "textarea",
    placeholder: "Google Sheets, HubSpot, WhatsApp, custom internal dashboard…",
    required: true,
  },
  {
    id: "integrations",
    section: "Technology stack",
    title: "Are these systems integrated with each other?",
    type: "multi-select",
    options: [
      { value: "fully", label: "Fully integrated" },
      { value: "partially", label: "Partially integrated" },
      { value: "mostly-manual", label: "Mostly manual" },
      { value: "none", label: "No integration" },
      { value: "custom-integrations", label: "Custom / ad-hoc integrations" },
    ],
    required: true,
    allowOtherText: true,
  },
  {
    id: "performanceTracking",
    section: "Data & decisions",
    title: "How do you currently track business performance?",
    type: "multi-select",
    options: [
      { value: "dashboard", label: "Dashboard / BI tools" },
      { value: "crm-reports", label: "CRM reports" },
      { value: "spreadsheets", label: "Manual spreadsheets" },
      { value: "no-tracking", label: "We don't track much" },
    ],
    required: true,
    allowOtherText: true,
  },
  {
    id: "scalabilityBreak",
    section: "Scalability",
    title: "If your business suddenly got 3× more customers, what would break first?",
    helper: "Think about support, fulfillment, reporting, inventory, or sales follow-ups.",
    type: "multi-select",
    options: [
      { value: "customer-support", label: "Customer support" },
      { value: "fulfillment", label: "Fulfillment / delivery" },
      { value: "sales-followups", label: "Sales follow-ups" },
      { value: "reporting", label: "Reporting / analytics" },
      { value: "inventory", label: "Inventory / capacity" },
    ],
    placeholder: "Customer support would be overwhelmed and response times would spike…",
    required: true,
    allowOtherText: true,
  },
  {
    id: "priority",
    section: "Strategic priority",
    title: "What is your biggest priority right now?",
    type: "multi-select",
    options: [
      { value: "increase-revenue", label: "Increase revenue" },
      { value: "reduce-cost", label: "Reduce operational cost" },
      { value: "improve-efficiency", label: "Improve efficiency" },
      { value: "better-experience", label: "Better customer experience" },
      { value: "scale-faster", label: "Scale faster" },
    ],
    required: true,
    allowOtherText: true,
  },
  {
    id: "singlePointOfFailure",
    section: "Brutal question",
    title: "If your team stopped working for 1 week, what part of your business would completely stop?",
    helper: "This exposes your single biggest automation opportunity.",
    type: "textarea",
    placeholder: "Fulfillment would completely stop because everything is coordinated manually…",
    required: true,
  },
];

