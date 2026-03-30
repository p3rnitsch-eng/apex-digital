export interface Contact {
  name: string;
  email: string;
  message: string;
  timestamp: bigint;
}

export interface LeadNote {
  id: string;
  body: string;
  createdAt: bigint;
}

export interface ProjectSubmission {
  projectId: string;
  package: string;
  clientName: string;
  email: string;
  businessName: string;
  currentWebsite: string;
  businessType: string;
  whatTheyNeed: string;
  projectDescription: string;
  numberOfPages: string;
  needsContactForm: boolean;
  needsBooking: boolean;
  needsPaymentIntegration: boolean;
  needsDashboard: boolean;
  needsContentWriting: boolean;
  needsBranding: boolean;
  inspirationLinks: string;
  timeline: string;
  contentReadiness: string;
  additionalNotes: string;
  paymentStatus: string;
  transactionHash: string;
  crmStatus: string;
  priority: string;
  quoteStatus: string;
  quoteAmount: string;
  quoteSummary: string;
  quoteToken?: string;
  quoteExpiresAt?: bigint;
  followUpAt?: bigint;
  internalNotes: LeadNote[];
  timestamp: bigint;
  lastUpdated: bigint;
}

export interface PublicQuote {
  projectId: string;
  clientName: string;
  businessName: string;
  package: string;
  quoteAmount: string;
  quoteSummary: string;
  quoteStatus: string;
  quoteExpiresAt?: bigint;
}

export interface AdminStats {
  totalProjects: bigint;
  totalContacts: bigint;
  paidProjects: bigint;
  pendingProjects: bigint;
  followUpsDue: bigint;
}

export interface AdminDashboard {
  projects: ProjectSubmission[];
  contacts: Contact[];
  stats: AdminStats;
}
