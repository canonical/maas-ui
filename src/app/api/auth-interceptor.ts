import { client } from "@/app/apiclient/client.gen";
import { getCookie } from "@/app/utils";

/**
 * Configures the API client to automatically include Authorization header
 * with Bearer token from cookies on all requests.
 *
 * @param store - Redux store instance
 */
export const configureAuthInterceptor = () => {
  client.interceptors.request.use((request) => {
    const token = getCookie("maas_v3_access_token");

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }

    return request;
  });
};
