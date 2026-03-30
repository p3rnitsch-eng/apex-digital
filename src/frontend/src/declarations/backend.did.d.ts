/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';

export interface Contact {
  'name' : string,
  'email' : string,
  'message' : string,
  'timestamp' : bigint,
}
export interface LeadNote {
  'id' : string,
  'body' : string,
  'createdAt' : bigint,
}
export interface ProjectSubmission {
  'projectId' : string,
  'package' : string,
  'clientName' : string,
  'email' : string,
  'businessName' : string,
  'currentWebsite' : string,
  'businessType' : string,
  'whatTheyNeed' : string,
  'projectDescription' : string,
  'numberOfPages' : string,
  'needsContactForm' : boolean,
  'needsBooking' : boolean,
  'needsPaymentIntegration' : boolean,
  'needsDashboard' : boolean,
  'needsContentWriting' : boolean,
  'needsBranding' : boolean,
  'inspirationLinks' : string,
  'timeline' : string,
  'contentReadiness' : string,
  'additionalNotes' : string,
  'paymentStatus' : string,
  'transactionHash' : string,
  'crmStatus' : string,
  'priority' : string,
  'quoteStatus' : string,
  'quoteAmount' : string,
  'quoteSummary' : string,
  'quoteToken' : [] | [string],
  'quoteExpiresAt' : [] | [bigint],
  'followUpAt' : [] | [bigint],
  'internalNotes' : Array<LeadNote>,
  'timestamp' : bigint,
  'lastUpdated' : bigint,
}
export interface PublicQuote {
  'projectId' : string,
  'clientName' : string,
  'businessName' : string,
  'package' : string,
  'quoteAmount' : string,
  'quoteSummary' : string,
  'quoteStatus' : string,
  'quoteExpiresAt' : [] | [bigint],
}
export interface AdminStats {
  'totalProjects' : bigint,
  'totalContacts' : bigint,
  'paidProjects' : bigint,
  'pendingProjects' : bigint,
  'followUpsDue' : bigint,
}
export interface AdminDashboard {
  'projects' : Array<ProjectSubmission>,
  'contacts' : Array<Contact>,
  'stats' : AdminStats,
}
export interface _SERVICE {
  'adminGetDashboard' : ActorMethod<[string], AdminDashboard>,
  'adminLogin' : ActorMethod<[string], [] | [string]>,
  'adminLogout' : ActorMethod<[string], undefined>,
  'adminCreateQuote' : ActorMethod<
    [string, string, string, string, [] | [bigint]],
    [] | [string]
  >,
  'adminDeleteContact' : ActorMethod<[string, bigint], boolean>,
  'adminDeleteProject' : ActorMethod<[string, string], boolean>,
  'adminUpdateProject' : ActorMethod<
    [string, string, string, string, [] | [bigint], [] | [string]],
    boolean
  >,
  'adminValidateSession' : ActorMethod<[string], boolean>,
  'getPublicQuote' : ActorMethod<[string, string], [] | [PublicQuote]>,
  'getContacts' : ActorMethod<[], Array<Contact>>,
  'getProjects' : ActorMethod<[], Array<ProjectSubmission>>,
  'submitContact' : ActorMethod<[string, string, string], undefined>,
  'submitProject' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      string,
      string,
      string,
      string,
    ],
    string
  >,
  'updatePaymentStatus' : ActorMethod<[string, string, string], boolean>,
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
