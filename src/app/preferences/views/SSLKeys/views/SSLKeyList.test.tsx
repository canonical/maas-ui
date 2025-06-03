import SSLKeyList, { Label as SSLKeyListLabels } from "./SSLKeyList";

import * as factory from "@/testing/factories";
import { sslKeyResolvers } from "@/testing/resolvers/sslKeys";
import {
  screen,
  setupMockServer,
  mockIsPending,
  waitForLoading,
  renderWithProviders,
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
    expect(screen.getByText("Loading")).toBeInTheDocument();
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

  it("can render the table", () => {
    renderWithProviders(<SSLKeyList />);
    expect(screen.getByRole("grid", { name: SSLKeyListLabels.Title }));
  });

  it("displays an empty state message", () => {
    mockServer.use(
      sslKeyResolvers.getSslKeys.handler({
        items: [],
        total: 0,
      })
    );
    renderWithProviders(<SSLKeyList />);

    expect(screen.getByText("No SSL keys available.")).toBeInTheDocument();
  });
});
