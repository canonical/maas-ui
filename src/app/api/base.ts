import { SERVICE_API } from "@/app/base/sagas/http";
import { getCookie } from "@/app/utils";

export const API_ENDPOINTS = {
  zones: "zones",
} as const;

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const handleErrors = (response: Response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

type ApiEndpoint = typeof API_ENDPOINTS;
export type ApiEndpointKey = keyof ApiEndpoint;
type ApiUrl = `${typeof SERVICE_API}${ApiEndpoint[ApiEndpointKey]}`;

export const getFullApiUrl = (endpoint: ApiEndpointKey): ApiUrl =>
  `${SERVICE_API}${API_ENDPOINTS[endpoint]}`;

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const csrftoken = getCookie("csrftoken");
  const headers = {
    ...DEFAULT_HEADERS,
    "X-CSRFToken": csrftoken || "",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  return handleErrors(response).json();
};
