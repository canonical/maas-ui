import { describe, it, expect, vi, beforeEach } from "vitest";

import { COOKIE_NAMES } from "../utils/cookies";

import {
  checkExternalSessionExpired,
  configureAuthInterceptor,
} from "./auth-interceptor";

import { client } from "@/app/apiclient/client.gen";
import { statusActions } from "@/app/store/status";
import { getCookie } from "@/app/utils";
import { store } from "@/redux-store";

vi.mock("@/app/apiclient/client.gen", () => ({
  client: {
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
  },
}));

vi.mock("@/redux-store", () => ({
  store: {
    dispatch: vi.fn(),
    getState: vi.fn(),
  },
}));

vi.mock("@/app/utils", () => ({
  getCookie: vi.fn(),
}));

describe("configureAuthInterceptor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds Authorization header when token exists", async () => {
    vi.mocked(getCookie).mockReturnValue("test-token-123");
    const mockRequest = {
      headers: new Headers(),
    } as Request;

    configureAuthInterceptor();

    const interceptor = vi.mocked(client.interceptors.request.use).mock
      .calls[0][0];

    const result = await interceptor(mockRequest, { url: "" });

    expect(getCookie).toHaveBeenCalledWith(COOKIE_NAMES.LOCAL_JWT_TOKEN_NAME);
    expect(result.headers.get("Authorization")).toBe("Bearer test-token-123");
  });

  it("does not add Authorization header when token is null", async () => {
    vi.mocked(getCookie).mockReturnValue(null);

    const request = {
      headers: new Headers(),
    } as Request;

    configureAuthInterceptor();

    const interceptor = vi.mocked(client.interceptors.request.use).mock
      .calls[0][0];

    const result = await interceptor(request, { url: "" });

    expect(result.headers.get("Authorization")).toBeNull();
  });
});

describe("checkExternalSessionExpired", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("expires the external session on a discharge required 401 when authenticated", async () => {
    vi.mocked(store.getState).mockReturnValue({
      status: { authenticated: true },
    } as ReturnType<typeof store.getState>);

    checkExternalSessionExpired();

    const interceptor = vi.mocked(client.interceptors.response.use).mock
      .calls[0][0];
    const response = new Response(
      JSON.stringify({ Code: "macaroon discharge required" }),
      { status: 401 }
    );

    const result = await interceptor(
      response,
      new Request("http://example.com/MAAS/a/v3/users/me"),
      { url: "/MAAS/a/v3/users/me" }
    );

    expect(result).toBe(response);
    expect(store.dispatch).toHaveBeenCalledWith(
      statusActions.externalSessionExpired()
    );
  });

  it("ignores discharge required startup 401 responses when unauthenticated", async () => {
    vi.mocked(store.getState).mockReturnValue({
      status: { authenticated: false },
    } as ReturnType<typeof store.getState>);

    checkExternalSessionExpired();

    const interceptor = vi.mocked(client.interceptors.response.use).mock
      .calls[0][0];
    const response = new Response(
      JSON.stringify({ Code: "macaroon discharge required" }),
      { status: 401 }
    );

    const result = await interceptor(
      response,
      new Request("http://example.com/MAAS/a/v3/users/me"),
      { url: "/MAAS/a/v3/users/me" }
    );

    expect(result).toBe(response);
    expect(store.dispatch).not.toHaveBeenCalledWith(
      statusActions.externalSessionExpired()
    );
  });

  it("ignores non-discharge 401 responses when authenticated", async () => {
    vi.mocked(store.getState).mockReturnValue({
      status: { authenticated: true },
    } as ReturnType<typeof store.getState>);

    checkExternalSessionExpired();

    const interceptor = vi.mocked(client.interceptors.response.use).mock
      .calls[0][0];
    const response = new Response(JSON.stringify({ kind: "Error" }), {
      status: 401,
    });

    const result = await interceptor(
      response,
      new Request("http://example.com/MAAS/a/v3/users/me"),
      { url: "/MAAS/a/v3/users/me" }
    );

    expect(result).toBe(response);
    expect(store.dispatch).not.toHaveBeenCalledWith(
      statusActions.externalSessionExpired()
    );
  });
});
