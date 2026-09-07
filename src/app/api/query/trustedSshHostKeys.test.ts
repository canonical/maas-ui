import {
  useCreateTrustedSshHostKey,
  useDeleteTrustedSshHostKey,
  useTrustedSshHostKeys,
} from "./trustedSshHostKeys";

import { listSshHostKeysQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import {
  mockSshHostKeys,
  sshHostKeysResolvers,
} from "@/testing/resolvers/sshHostKeys";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  sshHostKeysResolvers.listSshHostKeys.handler(),
  sshHostKeysResolvers.createSshHostKey.handler(),
  sshHostKeysResolvers.deleteSshHostKey.handler()
);

describe("useTrustedSshHostKeys", () => {
  it("should return a list of trusted SSH host keys", async () => {
    const { result } = renderHookWithProviders(() => useTrustedSshHostKeys());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items).toEqual(mockSshHostKeys.items);
  });
});

describe("useCreateTrustedSshHostKey", () => {
  it("should create a trusted SSH host key and invalidate the list", async () => {
    const { result, queryClient } = renderHookWithProviders(() =>
      useCreateTrustedSshHostKey()
    );
    const queryKey = listSshHostKeysQueryKey();
    queryClient.setQueryData(queryKey, mockSshHostKeys);

    result.current.mutate({
      body: {
        host: "192.168.1.1",
        key_type: "ssh-ed25519",
        public_key: "AAAAC3NzaC1lZDI1NTE5AAAAIKV6QaqOcp8OMe9tw0i3aB7z",
        label: "rack-1",
      },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(queryClient.getQueryState(queryKey)?.isInvalidated).toBe(true);
  });
});

describe("useDeleteTrustedSshHostKey", () => {
  it("should delete a trusted SSH host key and invalidate the list", async () => {
    const { result, queryClient } = renderHookWithProviders(() =>
      useDeleteTrustedSshHostKey()
    );
    const queryKey = listSshHostKeysQueryKey();
    queryClient.setQueryData(queryKey, mockSshHostKeys);

    result.current.mutate({ path: { ssh_host_key_id: 1 } });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(queryClient.getQueryState(queryKey)?.isInvalidated).toBe(true);
  });
});
