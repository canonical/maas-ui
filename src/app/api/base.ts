import { getCookie } from "@/app/utils";

export const ROOT_API = "/MAAS/api/2.0/";

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
