function headers(): Record<string, string> {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function get(url: string): Promise<any> {
  return fetch(url, {
    headers: headers(),
  }).then((resp) => resp.json());
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
