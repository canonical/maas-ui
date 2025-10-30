import {
  useActiveOauthProvider,
  useAuthenticate,
  useCompleteIntro,
  useCreateOauthProvider,
  useDeleteOauthProvider,
  useGetCurrentUser,
  useGetIsSuperUser,
  useUpdateOauthProvider,
} from "@/app/api/query/auth";
import {
  authResolvers,
  mockAuth,
  mockOauthProvider,
} from "@/testing/resolvers/auth";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  authResolvers.authenticate.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.completeIntro.handler(),
  authResolvers.getActiveOauthProvider.handler(),
  authResolvers.createOauthProvider.handler(),
  authResolvers.updateOauthProvider.handler(),
  authResolvers.deleteOauthProvider.handler()
);

describe("useAuthenticate", () => {
  it("should authenticate the user", async () => {
    const { result } = renderHookWithProviders(() => useAuthenticate());
    result.current.mutate({
      body: {
        username: "username",
        password: "password",
      },
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useGetCurrentUser", () => {
  it("should return the correct user", async () => {
    const expectedUser = mockAuth;
    const { result } = renderHookWithProviders(() => useGetCurrentUser());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(expectedUser);
  });
});

describe("useGetIsSuperUser", () => {
  it("should return the correct authorization", async () => {
    const expectedUser = mockAuth;
    const { result } = renderHookWithProviders(() => useGetIsSuperUser());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(expectedUser.is_superuser);
  });
});

describe("useCompleteIntro", () => {
  it("should complete intro", async () => {
    const { result } = renderHookWithProviders(() => useCompleteIntro());
    result.current.mutate({});
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useActiveOauthProvider", () => {
  it("should return the active OAuth provider", async () => {
    const expectedProvider = mockOauthProvider;
    const { result } = renderHookWithProviders(() => useActiveOauthProvider());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toStrictEqual(expectedProvider);
  });
});

describe("useCreateOauthProvider", () => {
  it("should create a new OAuth provider", async () => {
    const { result } = renderHookWithProviders(() => useCreateOauthProvider());
    result.current.mutate({ body: mockOauthProvider });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useUpdateOauthProvider", () => {
  it("should update an OAuth provider", async () => {
    const { result } = renderHookWithProviders(() => useUpdateOauthProvider());
    result.current.mutate({
      body: mockOauthProvider,
      path: { provider_id: 1 },
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useDeleteOauthProvider", () => {
  it("should delete an OAuth provider", async () => {
    const { result } = renderHookWithProviders(() => useDeleteOauthProvider());
    result.current.mutate({ path: { provider_id: 1 } });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
