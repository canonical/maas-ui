import SSHKeyList from "./SSHKeyList";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import urls from "@/app/preferences/urls";
import * as factory from "@/testing/factories";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  mockIsPending,
  renderWithBrowserRouter,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  within,
} from "@/testing/utils";

const mockKeys = {
  items: [
    factory.sshKeyV3({
      id: 1,
      key: "ssh-rsa aabb",
      protocol: "lp",
      auth_id: "springbokparty",
    }),
    factory.sshKeyV3({
      id: 2,
      key: "ssh-rsa ccdd",
      protocol: "gh",
      auth_id: "springbokparty",
    }),
    factory.sshKeyV3({
      id: 3,
      key: "ssh-rsa eeff",
      protocol: "lp",
      auth_id: "howzit",
    }),
    factory.sshKeyV3({
      id: 4,
      key: "ssh-rsa gghh",
      protocol: "gh",
      auth_id: "springbokparty",
    }),
    factory.sshKeyV3({
      id: 5,
      key: "ssh-rsa gghh",
      protocol: undefined,
      auth_id: undefined,
    }),
  ],
  total: 5,
};

const mockServer = setupMockServer(
  sshKeyResolvers.listSshKeys.handler(mockKeys)
);

const waitForLoading = async () =>
  await waitFor(() =>
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument()
  );

describe("SSHKeyList", () => {
  const setSidePanelContent = vi.fn();

  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
  });

  it("displays a loading component if SSH keys are loading", () => {
    mockIsPending();
    renderWithProviders(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
    });
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  // fix this when error types are fixed in client
  it.skip("can display errors", () => {
    // state.sshkey.errors = "Unable to list SSH keys.";
    renderWithProviders(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
    });
    expect(screen.getByText("Unable to list SSH keys.")).toBeInTheDocument();
  });

  it("can group keys", async () => {
    renderWithProviders(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
    });

    await waitForLoading();

    const rows = screen.getAllByTestId("sshkey-row");

    // Two of the keys should be grouped together.
    expect(rows).toHaveLength(mockKeys.items.length - 1);
    // The grouped keys should be displayed in sub cols.
    expect(within(rows[0]).getByText("ssh-rsa aabb")).toBeInTheDocument();

    expect(within(rows[1]).getByText("ssh-rsa ccdd")).toBeInTheDocument();
    expect(within(rows[1]).getByText("ssh-rsa gghh")).toBeInTheDocument();

    expect(within(rows[2]).getByText("ssh-rsa eeff")).toBeInTheDocument();
  });

  it("displays the full SSH key value", async () => {
    renderWithProviders(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
    });
    const keyValue = mockKeys.items[2].key;

    await waitFor(() => {
      // verifies that the full value is exposed in the title attribute
      expect(screen.getByText(keyValue)).toHaveAccessibleName(keyValue);
    });
  });

  it("can display uploaded keys", async () => {
    renderWithProviders(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
    });

    await waitForLoading();

    const uploadedKeyRow = screen.getAllByTestId("sshkey-row")[3];

    expect(within(uploadedKeyRow).getByText("Upload")).toBeInTheDocument();
    expect(
      within(uploadedKeyRow).getByText("ssh-rsa gghh")
    ).toBeInTheDocument();
  });

  it("can display imported keys", async () => {
    renderWithProviders(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
    });

    await waitForLoading();

    const importedKeyRow = screen.getAllByTestId("sshkey-row")[0];

    expect(within(importedKeyRow).getByText("Launchpad")).toBeInTheDocument();
    expect(
      within(importedKeyRow).getByText("springbokparty")
    ).toBeInTheDocument();
    expect(
      within(importedKeyRow).getByText("ssh-rsa aabb")
    ).toBeInTheDocument();
  });

  it("can trigger a delete confirmation form", async () => {
    renderWithProviders(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
    });

    await waitForLoading();

    let row = screen.getAllByTestId("sshkey-row")[0];
    expect(row).not.toHaveClass("is-active");
    // Click on the delete button:
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(window.location.pathname).toBe(urls.sshKeys.delete);
  });

  it("displays a message if there are no SSH keys", async () => {
    mockServer.use(
      sshKeyResolvers.listSshKeys.handler({ items: [], total: 0 })
    );

    renderWithBrowserRouter(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
    });

    await waitForLoading();

    expect(screen.getByText("No SSH keys available.")).toBeInTheDocument();
  });
});
