import {
  useAuthenticate,
  useCompleteIntro,
  useGetIsSuperUser,
  useGetThisUser,
} from "@/app/api/query/auth";
import { authResolvers, mockAuth } from "@/testing/resolvers/auth";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  authResolvers.authenticate.handler(),
  authResolvers.getThisUser.handler(),
  authResolvers.completeIntro.handler()
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
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useGetThisUser", () => {
  it("should return the correct user", async () => {
    const expectedUser = mockAuth;
    const { result } = renderHookWithProviders(() => useGetThisUser());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(expectedUser);
  });
});

describe("useGetIsSuperUser", () => {
  it("should return the correct authorization", async () => {
    const expectedUser = mockAuth;
    const { result } = renderHookWithProviders(() => useGetIsSuperUser());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(expectedUser.is_superuser);
  });
});

describe("useCompleteIntro", () => {
  it("should complete intro", async () => {
    const { result } = renderHookWithProviders(() => useCompleteIntro());
    result.current.mutate({});
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
