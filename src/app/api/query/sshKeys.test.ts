import { useListSshKeys } from "./sshKeys";

import { mockSshKeys, sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(sshKeyResolvers.listSshKeys.handler());

describe("useListSshKeys", () => {
  it("should return SSH keys data", async () => {
    const { result } = renderHookWithProviders(() => useListSshKeys());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockSshKeys);
  });
});
