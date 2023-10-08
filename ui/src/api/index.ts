function headers(): Record<string, string> {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function get(url: string): Promise<any> {
  return fetch(url, {
    headers: headers(),
  }).then((resp) => resp.json());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function post(url: string, data: Record<string, unknown>): Promise<any> {
  return fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then((resp) => resp.json());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function patch(url: string, data: Record<string, unknown>): Promise<any> {
  return fetch(url, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(data),
  }).then((resp) => resp.json());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function del(url: string, data?: Record<string, unknown>): Promise<any> {
  const options: Record<string, unknown> = {
    method: 'DELETE',
    headers: headers(),
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return fetch(url, options).then((resp) => resp.json());
}
