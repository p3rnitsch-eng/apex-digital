/* eslint-disable */

// @ts-nocheck

import {
  Actor,
  HttpAgent,
  type HttpAgentOptions,
  type ActorConfig,
  type Agent,
  type ActorSubclass,
} from "@icp-sdk/core/agent";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";
import type {
  AdminDashboard,
  Contact,
  PublicQuote,
  ProjectSubmission,
} from "./backend.d";

export class ExternalBlob {
  _blob?: Uint8Array<ArrayBuffer> | null;
  directURL: string;
  onProgress?: (percentage: number) => void = undefined;

  private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null) {
    if (blob) {
      this._blob = blob;
    }
    this.directURL = directURL;
  }

  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(url, null);
  }

  static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
    const url = URL.createObjectURL(
      new Blob([new Uint8Array(blob)], {
        type: "application/octet-stream",
      }),
    );
    return new ExternalBlob(url, blob);
  }

  public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
    if (this._blob) {
      return this._blob;
    }
    const response = await fetch(this.directURL);
    const blob = await response.blob();
    this._blob = new Uint8Array(await blob.arrayBuffer());
    return this._blob;
  }

  public getDirectURL(): string {
    return this.directURL;
  }

  public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    this.onProgress = onProgress;
    return this;
  }
}

function candidSome<T>(value: T): [T] {
  return [value];
}

function candidNone<T>(): [] {
  return [];
}

function recordOptToUndefined<T>(value: T | null): T | undefined {
  return value == null ? undefined : value;
}

function unwrapCandidOpt<T>(value: [] | [T] | null | undefined): T | undefined {
  if (value == null) {
    return undefined;
  }
  return value.length === 0 ? undefined : value[0];
}

function normalizeProject(project: any): ProjectSubmission {
  return {
    ...project,
    quoteToken: unwrapCandidOpt(project.quoteToken),
    quoteExpiresAt: unwrapCandidOpt(project.quoteExpiresAt),
    followUpAt: unwrapCandidOpt(project.followUpAt),
  };
}

function normalizeDashboard(dashboard: any): AdminDashboard {
  return {
    ...dashboard,
    projects: dashboard.projects.map(normalizeProject),
  };
}

function normalizePublicQuote(quote: any): PublicQuote {
  return {
    ...quote,
    quoteExpiresAt: unwrapCandidOpt(quote.quoteExpiresAt),
  };
}

export interface backendInterface {
  adminGetDashboard(token: string): Promise<AdminDashboard>;
  adminLogin(password: string): Promise<string | undefined>;
  adminLogout(token: string): Promise<void>;
  adminCreateQuote(
    token: string,
    projectId: string,
    quoteAmount: string,
    quoteSummary: string,
    quoteExpiresAt?: bigint,
  ): Promise<string | undefined>;
  adminDeleteContact(token: string, timestamp: bigint): Promise<boolean>;
  adminDeleteProject(token: string, projectId: string): Promise<boolean>;
  adminUpdateProject(
    token: string,
    projectId: string,
    crmStatus: string,
    priority: string,
    followUpAt?: bigint,
    note?: string,
  ): Promise<boolean>;
  adminValidateSession(token: string): Promise<boolean>;
  getContacts(): Promise<Contact[]>;
  getPublicQuote(projectId: string, quoteToken: string): Promise<PublicQuote | undefined>;
  getProjects(): Promise<ProjectSubmission[]>;
  submitContact(name: string, email: string, message: string): Promise<void>;
  submitProject(
    package_: string,
    clientName: string,
    email: string,
    businessName: string,
    currentWebsite: string,
    businessType: string,
    whatTheyNeed: string,
    projectDescription: string,
    numberOfPages: string,
    needsContactForm: boolean,
    needsBooking: boolean,
    needsPaymentIntegration: boolean,
    needsDashboard: boolean,
    needsContentWriting: boolean,
    needsBranding: boolean,
    inspirationLinks: string,
    timeline: string,
    contentReadiness: string,
    additionalNotes: string,
  ): Promise<string>;
  updatePaymentStatus(projectId: string, status: string, txHash: string): Promise<boolean>;
}

export class Backend implements backendInterface {
  constructor(
    private actor: ActorSubclass<_SERVICE>,
    private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
    private processError?: (error: unknown) => never,
  ) {}

  async adminGetDashboard(token: string): Promise<AdminDashboard> {
    const dashboard = await this.wrap(() => this.actor.adminGetDashboard(token));
    return normalizeDashboard(dashboard);
  }

  async adminLogin(password: string): Promise<string | undefined> {
    const result = await this.wrap(() => this.actor.adminLogin(password));
    return result[0];
  }

  async adminLogout(token: string): Promise<void> {
    return this.wrap(() => this.actor.adminLogout(token));
  }

  async adminCreateQuote(
    token: string,
    projectId: string,
    quoteAmount: string,
    quoteSummary: string,
    quoteExpiresAt?: bigint,
  ): Promise<string | undefined> {
    const result = await this.wrap(() =>
      this.actor.adminCreateQuote(
        token,
        projectId,
        quoteAmount,
        quoteSummary,
        quoteExpiresAt === undefined ? candidNone() : candidSome(quoteExpiresAt),
      ),
    );
    return result[0];
  }

  async adminDeleteContact(token: string, timestamp: bigint): Promise<boolean> {
    return this.wrap(() => this.actor.adminDeleteContact(token, timestamp));
  }

  async adminDeleteProject(token: string, projectId: string): Promise<boolean> {
    return this.wrap(() => this.actor.adminDeleteProject(token, projectId));
  }

  async adminUpdateProject(
    token: string,
    projectId: string,
    crmStatus: string,
    priority: string,
    followUpAt?: bigint,
    note?: string,
  ): Promise<boolean> {
    return this.wrap(() =>
      this.actor.adminUpdateProject(
        token,
        projectId,
        crmStatus,
        priority,
        followUpAt === undefined ? candidNone() : candidSome(followUpAt),
        note ? candidSome(note) : candidNone(),
      ),
    );
  }

  async adminValidateSession(token: string): Promise<boolean> {
    return this.wrap(() => this.actor.adminValidateSession(token));
  }

  async getContacts(): Promise<Contact[]> {
    return this.wrap(() => this.actor.getContacts());
  }

  async getPublicQuote(projectId: string, quoteToken: string): Promise<PublicQuote | undefined> {
    const result = await this.wrap(() => this.actor.getPublicQuote(projectId, quoteToken));
    const quote = recordOptToUndefined(result[0] as PublicQuote | null);
    return quote ? normalizePublicQuote(quote) : undefined;
  }

  async getProjects(): Promise<ProjectSubmission[]> {
    const projects = await this.wrap(() => this.actor.getProjects());
    return projects.map(normalizeProject);
  }

  async submitContact(name: string, email: string, message: string): Promise<void> {
    return this.wrap(() => this.actor.submitContact(name, email, message));
  }

  async submitProject(
    package_: string,
    clientName: string,
    email: string,
    businessName: string,
    currentWebsite: string,
    businessType: string,
    whatTheyNeed: string,
    projectDescription: string,
    numberOfPages: string,
    needsContactForm: boolean,
    needsBooking: boolean,
    needsPaymentIntegration: boolean,
    needsDashboard: boolean,
    needsContentWriting: boolean,
    needsBranding: boolean,
    inspirationLinks: string,
    timeline: string,
    contentReadiness: string,
    additionalNotes: string,
  ): Promise<string> {
    return this.wrap(() =>
      this.actor.submitProject(
        package_,
        clientName,
        email,
        businessName,
        currentWebsite,
        businessType,
        whatTheyNeed,
        projectDescription,
        numberOfPages,
        needsContactForm,
        needsBooking,
        needsPaymentIntegration,
        needsDashboard,
        needsContentWriting,
        needsBranding,
        inspirationLinks,
        timeline,
        contentReadiness,
        additionalNotes,
      ),
    );
  }

  async updatePaymentStatus(projectId: string, status: string, txHash: string): Promise<boolean> {
    return this.wrap(() => this.actor.updatePaymentStatus(projectId, status, txHash));
  }

  private async wrap<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.processError) {
      return fn();
    }

    try {
      return await fn();
    } catch (e) {
      this.processError(e);
      throw new Error("unreachable");
    }
  }
}

export interface CreateActorOptions {
  agent?: Agent;
  agentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
  processError?: (error: unknown) => never;
}

export function createActor(
  canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
  options: CreateActorOptions = {},
): Backend {
  const agent =
    options.agent ||
    HttpAgent.createSync({
      ...options.agentOptions,
    });
  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.",
    );
  }
  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}

export type { AdminDashboard, Contact, ProjectSubmission };
