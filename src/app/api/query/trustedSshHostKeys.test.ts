import { useTrustedSshHostKeys } from "./trustedSshHostKeys";

import {
  mockSshHostKeys,
  sshHostKeysResolvers,
} from "@/testing/resolvers/sshHostKeys";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(sshHostKeysResolvers.listSshHostKeys.handler());

describe("useTrustedSshHostKeys", () => {
  it("should return a list of trusted SSH host keys", async () => {
    const { result } = renderHookWithProviders(() => useTrustedSshHostKeys());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items).toEqual(mockSshHostKeys.items);
  });
});
