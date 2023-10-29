import { getJ, postB } from '@/api';

export interface Err {
  code: number;
  msg: string;
}

export interface Stats {
  bat: number;
  bat_raw: number;
  type: number;
  lux: number;
  ldr_raw: number;
  ram: number;
  bri: number;
  temp: number;
  hum: number;
  uptime: number;
  wifi_signal: number;
  messages: number;
  version: string;
  indicator1: boolean;
  indicator2: boolean;
  indicator3: boolean;
  app: string;
  uid: string;

  error?: Err; // proxy error
}

export function getStats(ipv4: string): Promise<Stats> {
  return getJ(`/awtrix/${ipv4}/api/stats`);
}

// https://github.com/Blueforcer/awtrix-light/blob/main/docs/api.md#change-settings
export interface Settings {
  ATIME: number; // Duration an app is displayed in seconds
  TEFF: number; // Choose between app transition effects, 0-10
                // see https://github.com/Blueforcer/awtrix-light/blob/main/docs/api.md
  TSPEED: number;// Time taken for the transition to the next app in milliseconds
  TCOL: number; // Global text color
  TMODE: number; // Changes the time app style, 0-4
  CHCOL: number; // Calendar header color of the time app
  CBCOL: number; // Calendar body color of the time app
  CTCOL: number; // Calendar text color in the time app
  WD: boolean; // Enable or disable the weekday display.
  WDCA: number; // Active weekday color
  WDCI: number; // Inactive weekday color
  BRI: number; // Matrix brightness, 0-255
  ABRI: boolean; // Automatic brightness control
  ATRANS: boolean; // Automatic switching to the next app
  CCORRECTION: string; // Color correction for the matrix
  CTEMP: string; // Color temperature for the matrix
  TFORMAT: string; // Time format for the TimeApp,
                   // see https://github.com/Blueforcer/awtrix-light/blob/main/docs/api.md
  DFORMAT: string; // Date format for the DateApp
                   // see https://github.com/Blueforcer/awtrix-light/blob/main/docs/api.md
  SOM: boolean; // Start the week on Monday
  BLOCKN: boolean; // Block physical navigation keys (still sends input to MQTT)
  UPPERCASE: boolean; // Display text in uppercase
  TIME_COL: number; // Text color of the time app (0 for global text color)
  DATE_COL: number; // Text color of the date app (0 for global text color)
  TEMP_COL: number; // Text color of the temperature app (0 for global text color)
  HUM_COL: number; // Text color of the humidity app (0 for global text color)
  BAT_COL: number; // Text color of the battery app (0 for global text color)
  SSPEED: number; // Scroll speed modification
  TIM: boolean; // Enable or disable the native time app (requires reboot)
  DAT: boolean; // Enable or disable the native date app (requires reboot)
  HUM: boolean; // Enable or disable the native humidity app (requires reboot)
  TEMP: boolean; // Enable or disable the native temperature app (requires reboot)
  BAT: boolean; // Enable or disable the native battery app (requires reboot)
  MATP: boolean; // not documented
  CEL: boolean; // not documented
  MAT: number; // not documented
  SOUND: boolean; // not documented
  GAMMA: number; // not documented

  error?: Err; // proxy error
}

export function getSettings(ipv4: string): Promise<Settings> {
  return getJ(`/awtrix/${ipv4}/api/settings`);
}

export function updateSettings(ipv4: string, data: Record<string, unknown>): Promise<boolean> {
  return postB(`/awtrix/${ipv4}/api/settings`, data);
}

export interface Status {
  type: string;
  isOk: boolean;
  totalBytes: string;
  usedBytes: string;

  error?: Err; // proxy error
}

export function getStatus(ipv4: string): Promise<Status> {
  return getJ(`/awtrix/${ipv4}/status`);
}

export interface Release {
  tag_name: string;
  html_url: string;
}

export function getLatestRelease(): Promise<{release?: Release, error?: Err}> {
  return getJ('/api/v1/awtrix-light/release');
}

export function prevApp(ipv4: string): Promise<boolean> {
  return postB(`/awtrix/${ipv4}/api/previousapp`, {});
}

export function nextApp(ipv4: string): Promise<boolean> {
  return postB(`/awtrix/${ipv4}/api/nextapp`, {});
}

export function reboot(ipv4: string): Promise<boolean> {
  return postB(`/awtrix/${ipv4}/api/reboot`, {});
}

export function resetSettings(ipv4: string): Promise<boolean> {
  return postB(`/awtrix/${ipv4}/api/resetSettings`, {});
}
