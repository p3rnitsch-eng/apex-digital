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
import type { AdminDashboard, Contact } from "./backend.d";

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

export interface backendInterface {
  adminDeleteContact(token: string, timestamp: bigint): Promise<boolean>;
  adminGetDashboard(token: string): Promise<AdminDashboard>;
  adminLogin(password: string): Promise<string | undefined>;
  adminLogout(token: string): Promise<void>;
  adminValidateSession(token: string): Promise<boolean>;
  submitContact(name: string, email: string, message: string): Promise<void>;
}

export class Backend implements backendInterface {
  constructor(
    private actor: ActorSubclass<_SERVICE>,
    private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
    private processError?: (error: unknown) => never,
  ) {}

  async adminDeleteContact(token: string, timestamp: bigint): Promise<boolean> {
    return this.wrap(() => this.actor.adminDeleteContact(token, timestamp));
  }

  async adminGetDashboard(token: string): Promise<AdminDashboard> {
    const dashboard = await this.wrap(() => this.actor.adminGetDashboard(token));
    return {
      contacts: dashboard.contacts,
    };
  }

  async adminLogin(password: string): Promise<string | undefined> {
    const result = await this.wrap(() => this.actor.adminLogin(password));
    return result[0];
  }

  async adminLogout(token: string): Promise<void> {
    return this.wrap(() => this.actor.adminLogout(token));
  }

  async adminValidateSession(token: string): Promise<boolean> {
    return this.wrap(() => this.actor.adminValidateSession(token));
  }

  async submitContact(name: string, email: string, message: string): Promise<void> {
    return this.wrap(() => this.actor.submitContact(name, email, message));
  }

  private async wrap<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.processError) {
      return fn();
    }

    try {
      return await fn();
    } catch (error) {
      this.processError(error);
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

export type { AdminDashboard, Contact };
