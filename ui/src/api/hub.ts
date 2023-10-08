import { get, post, patch, del } from '@/api'; // eslint-disable-line object-curly-newline

export interface ErrItem {
  subject: string;
  msg: string;
}

export interface Err {
  code: number;
  msg: string;
  items?: ErrItem[];
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

export function getBuildInfo(): Promise<BuildInfo> {
  return get('/api/v1/status/buildinfo');
}

export interface Node {
  id: string;
  name: string;
  ipv4: string;
  createdAt: string;
  updatedAt: string;
}

export function listNodes(): Promise<{nodes?: Node[], error?: Err}> {
  return get('/api/v1/nodes');
}

export function createNode(data: Record<string, unknown>): Promise<{node?: Node, error?: Err}> {
  return post('/api/v1/nodes', data);
}

export function updateNode(data: Record<string, unknown>): Promise<{node?: Node, error?: Err}> {
  return patch(`/api/v1/nodes/${data.id}`, data);
}

export function deleteNode(id: string): Promise<{error?: Err}> {
  return del(`/api/v1/nodes/${id}`);
}
