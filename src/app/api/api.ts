import { getCookie } from "../utils";

import { ApiClient } from "@/app/api/client";

export const baseURL = import.meta.env.VITE_API_URL;

export const apiClient = new ApiClient({
  BASE: baseURL,
  TOKEN: getCookie("csrftoken") ?? "",
});

export default apiClient;
