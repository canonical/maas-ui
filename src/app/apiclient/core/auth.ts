export type AuthToken = string | undefined;

export interface Auth {
  /**
   * Which part of the request do we use to send the auth?
   *
   * @default 'header'
   */
  in?: "cookie" | "header" | "query";
  /**
   * Header or query parameter name.
   *
   * @default 'Authorization'
   */
  name?: string;
  scheme?: "basic" | "bearer";
  type: "apiKey" | "http";
}

export const getAuthToken = async (
  auth: Auth,
  callback: AuthToken | ((auth: Auth) => AuthToken | Promise<AuthToken>)
): Promise<string | undefined> => {
  const token =
    typeof callback === "function" ? await callback(auth) : callback;

  if (!token) {
    return;
  }

  if (auth.scheme === "bearer") {
    return `Bearer ${token}`;
  }

  if (auth.scheme === "basic") {
    return `Basic ${btoa(token)}`;
  }

  return token;
};
