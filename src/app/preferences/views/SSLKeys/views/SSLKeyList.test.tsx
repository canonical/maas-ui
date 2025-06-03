import SSLKeyList from "./SSLKeyList";

import * as factory from "@/testing/factories";
import { sslKeyResolvers } from "@/testing/resolvers/sslKeys";
import {
  screen,
  setupMockServer,
  mockIsPending,
  waitForLoading,
  renderWithProviders,
  waitFor,
} from "@/testing/utils";

const mockKeys = {
  items: [
    factory.sslKey({
      id: 1,
      key: "ssh-rsa aabb",
    }),
    factory.sslKey({
      id: 2,
      key: "ssh-rsa ccdd",
    }),
    factory.sslKey({
      id: 3,
      key: "ssh-rsa eeff",
    }),
    factory.sslKey({
      id: 4,
      key: "ssh-rsa gghh",
    }),
    factory.sslKey({
      id: 5,
      key: "ssh-rsa gghh",
    }),
  ],
  total: 5,
};

const mockServer = setupMockServer(
  sslKeyResolvers.getSslKeys.handler(mockKeys)
);

describe("SSLKeyList", () => {
  it("displays a loading component if machines are loading", () => {
    mockIsPending();
    renderWithProviders(<SSLKeyList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("can display errors", async () => {
    mockServer.use(
      sslKeyResolvers.getSslKeys.error({
        message: "Unable to list SSL keys",
        code: 400,
      })
    );
    renderWithProviders(<SSLKeyList />);
    await waitForLoading();
    expect(screen.getByText("Unable to list SSL keys")).toBeInTheDocument();
  });

  it("displays an empty state message", async () => {
    mockServer.use(
      sslKeyResolvers.getSslKeys.handler({
        items: [],
        total: 0,
      })
    );
    renderWithProviders(<SSLKeyList />);

    await waitFor(() => {
      expect(screen.getByText("No SSL keys available.")).toBeInTheDocument();
    });
  });
});
