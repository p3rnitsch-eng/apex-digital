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
export interface TrackedCanisterStatus {
  'name' : string,
  'canisterId' : string,
  'kind' : string,
  'siteUrl' : string,
  'status' : string,
  'cycles' : [] | [bigint],
  'memorySize' : [] | [bigint],
  'idleCyclesBurnedPerDay' : [] | [bigint],
  'error' : [] | [string],
}
export interface TrackedCanisterInput {
  'name' : string,
  'canisterId' : string,
  'kind' : string,
  'siteUrl' : string,
}
export interface OpsDashboard {
  'ownCycles' : bigint,
  'tracked' : Array<TrackedCanisterStatus>,
}
export interface TrackedCanister {
  'id' : string,
  'displayName' : string,
  'network' : string,
  'canisterId' : string,
  'kind' : string,
  'siteUrl' : string,
  'notes' : string,
}
export interface CanisterStatusSnapshot {
  'canisterId' : string,
  'fetchedAt' : bigint,
  'status' : string,
  'controllers' : Array<string>,
  'balanceCycles' : bigint,
  'idleBurnPerDay' : bigint,
  'memorySizeBytes' : bigint,
  'queryCount' : bigint,
  'queryResponseBytes' : bigint,
  'moduleHash' : string,
  'error' : string,
}
export interface InfraRefreshState {
  'refreshInProgress' : boolean,
  'lastRefreshStartedAt' : [] | [bigint],
  'lastRefreshCompletedAt' : [] | [bigint],
  'lastRefreshStatus' : string,
  'lastRefreshError' : string,
}
export interface _SERVICE {
  'adminGetDashboard' : ActorMethod<[string], AdminDashboard>,
  'adminGetLatestCanisterSnapshots' : ActorMethod<[string], Array<CanisterStatusSnapshot>>,
  'adminGetInfraRefreshState' : ActorMethod<[string], InfraRefreshState>,
  'adminInspectCanisters' : ActorMethod<[string, Array<TrackedCanisterInput>], OpsDashboard>,
  'adminDeleteTrackedCanister' : ActorMethod<[string, string], boolean>,
  'adminLogin' : ActorMethod<[string], [] | [string]>,
  'adminListTrackedCanisters' : ActorMethod<[string], Array<TrackedCanister>>,
  'adminLogout' : ActorMethod<[string], undefined>,
  'adminMarkInfraRefreshFinished' : ActorMethod<[string, string, string], boolean>,
  'adminMarkInfraRefreshStarted' : ActorMethod<[string], boolean>,
  'adminCreateQuote' : ActorMethod<
    [string, string, string, string, [] | [bigint]],
    [] | [string]
  >,
  'adminDeleteContact' : ActorMethod<[string, bigint], boolean>,
  'adminDeleteProject' : ActorMethod<[string, string], boolean>,
  'adminSaveCanisterSnapshot' : ActorMethod<[string, CanisterStatusSnapshot], boolean>,
  'adminUpdateProject' : ActorMethod<
    [string, string, string, string, [] | [bigint], [] | [string]],
    boolean
  >,
  'adminValidateSession' : ActorMethod<[string], boolean>,
  'adminUpsertTrackedCanister' : ActorMethod<[string, TrackedCanister], boolean>,
  'getCycles' : ActorMethod<[], bigint>,
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
