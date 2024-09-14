"use client";
import camelcaseKeys from "camelcase-keys";

import {
  PROXY_PATH,
  REQUEST_CONTENT_TYPE,
  REQUEST_METHOD,
} from "@/constants/http";

export class HttpError extends Error {
  status: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, status: number, response: any) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

type Options = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  contentType?: (typeof REQUEST_CONTENT_TYPE)[keyof typeof REQUEST_CONTENT_TYPE];
};

type Data = Options & {
  method: (typeof REQUEST_METHOD)[keyof typeof REQUEST_METHOD];
};

const creteBody = ({
  body,
  contentType = REQUEST_CONTENT_TYPE.APPLICATION_JSON,
}: Data): FormData | string | null => {
  if (!body) {
    return null;
  }
  if (contentType === REQUEST_CONTENT_TYPE.APPLICATION_JSON) {
    return JSON.stringify(body);
  }
  return null;
};

const createUrl = (url: string): string => [PROXY_PATH, url].join("");

const createHeader = (): //   contentType?: Options["contentType"]
{ [key: string]: string } => {
  const headers: { [key: string]: string } = {};
  return headers;
};

const checkCasso = (error: HttpError): void => {
  if (error && [302, 401, 403].includes(error.status)) {
    // ページリロード
    window.location.reload();
  }
};

const fetcher = <T>(url: string, data: Data): Promise<T> =>
  fetch(createUrl(url), {
    method: data.method,
    // headers: createHeader(data.contentType),
    headers: createHeader(),
    body: creteBody(data),
  })
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      throw new HttpError("エラー", res.status, await res.json());
    })
    .then((x) => camelcaseKeys(x, { deep: true }))
    .catch((e) => {
      checkCasso(e);
      throw e;
    });

const method = {
  get: <T>(url: string): Promise<T> =>
    fetcher(url, { method: REQUEST_METHOD.GET }),
  post: <T>(url: string, options: Options): Promise<T> =>
    fetcher(url, { method: REQUEST_METHOD.POST, ...options }),
  put: <T>(url: string, options: Options): Promise<T> =>
    fetcher(url, { method: REQUEST_METHOD.PUT, ...options }),
  delete: <T>(url: string, options: Options): Promise<T> =>
    fetcher(url, { method: REQUEST_METHOD.DELETE, ...options }),
  patch: <T>(url: string, options: Options): Promise<T> =>
    fetcher(url, { method: REQUEST_METHOD.PATCH, ...options }),
};

export default method;
