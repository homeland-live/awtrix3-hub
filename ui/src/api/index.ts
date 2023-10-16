function headers(): Record<string, string> {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

export function get(url: string): Promise<Response> {
  return fetch(url, {
    headers: headers(),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getJ(url: string): Promise<any> {
  return get(url).then((resp) => resp.json());
}

export function post(url: string, data: Record<string, unknown>): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function postJ(url: string, data: Record<string, unknown>): Promise<any> {
  return post(url, data).then((resp) => resp.json());
}

export function postB(url: string, data: Record<string, unknown>): Promise<boolean> {
  return post(url, data).then((resp) => resp.status === 200);
}

export function patch(url: string, data: Record<string, unknown>): Promise<Response> {
  return fetch(url, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(data),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function patchJ(url: string, data: Record<string, unknown>): Promise<any> {
  return patch(url, data).then((resp) => resp.json());
}

export function del(url: string, data?: Record<string, unknown>): Promise<Response> {
  const options: Record<string, unknown> = {
    method: 'DELETE',
    headers: headers(),
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return fetch(url, options);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function delJ(url: string, data?: Record<string, unknown>): Promise<any> {
  return del(url, data).then((resp) => resp.json());
}
