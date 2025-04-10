import { useCreateSslKeys, useGetSslKeys } from "./sslKeys";

import type { SslKeyRequest } from "@/app/apiclient";
import { mockSslKeys, sslKeyResolvers } from "@/testing/resolvers/sslKeys";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  sslKeyResolvers.getSslKeys.handler(),
  sslKeyResolvers.createSslKey.handler()
);

describe("useGetSslKeys", () => {
  it("should return SSL keys data", async () => {
    const { result } = renderHookWithProviders(() => useGetSslKeys());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockSslKeys);
  });
});

describe("useCreateSslKeys", () => {
  it("should create a new SSL key", async () => {
    const newSslKey: SslKeyRequest = {
      key: "ssl-rsa aabb",
    };
    const { result } = renderHookWithProviders(() => useCreateSslKeys());
    result.current.mutate({ body: newSslKey });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
