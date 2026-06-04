import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Result<T = unknown> = {
  results?: T[];
  success: boolean;
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = unknown>(): Promise<D1Result<T>>;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
};

export type D1DatabaseLike = {
  exec(query: string): Promise<D1Result>;
  prepare(query: string): D1PreparedStatement;
};

export type R2ObjectLike = {
  body: ReadableStream;
  httpMetadata?: {
    contentType?: string;
  };
};

export type R2BucketLike = {
  get(key: string): Promise<R2ObjectLike | null>;
  put(
    key: string,
    value: ArrayBuffer | ReadableStream | string,
    options?: { httpMetadata?: { contentType?: string } }
  ): Promise<unknown>;
  delete(key: string): Promise<void>;
};

export type CloudflareRuntimeEnv = {
  DB?: D1DatabaseLike;
  MEDIA_BUCKET?: R2BucketLike;
  MEDIA_PUBLIC_URL?: string;
};

export function getCloudflareEnv(): CloudflareRuntimeEnv {
  try {
    return getCloudflareContext().env as CloudflareRuntimeEnv;
  } catch {
    return {};
  }
}
