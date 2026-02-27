import { getJ, postJ, patchJ, delJ } from '@/api';

export interface ErrItem {
  subject: string;
  msg: string;
}

export interface Err {
  code: number;
  msg: string;
  items?: ErrItem[];
}

export function getUiDeps(): Promise<Record<string, string>> {
  return getJ(`/ui/deps.json?t=${Date.now()}`);
}

export interface BuildInfo {
  compiler: string;
  os: string;
  arch: string;
  commit: string;
  ref: string;
  buildTimeUTC: string;
  buildTimeLocal: string;
  serverUptime: string;
  serverTime: string;
  serverTimezone: string;
}

export function getStatusBuildInfo(): Promise<BuildInfo> {
  return getJ('/api/v1/status/buildinfo');
}

export interface Node {
  id: string;
  name: string;
  ipv4: string;
  createdAt: string;
  updatedAt: string;
}

export function listNodes(): Promise<{ nodes?: Node[]; error?: Err }> {
  return getJ('/api/v1/nodes');
}

export function createNode(data: Record<string, unknown>): Promise<{ node?: Node; error?: Err }> {
  return postJ('/api/v1/nodes', data);
}

export function updateNode(data: Record<string, unknown>): Promise<{ node?: Node; error?: Err }> {
  return patchJ(`/api/v1/nodes/${data.id}`, data);
}

export function deleteNode(id: string): Promise<{ error?: Err }> {
  return delJ(`/api/v1/nodes/${id}`);
}
