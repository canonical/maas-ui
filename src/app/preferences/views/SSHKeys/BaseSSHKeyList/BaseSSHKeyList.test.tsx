import SSHKeyList from "./BaseSSHKeyList";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import urls from "@/app/preferences/urls";
import * as factory from "@/testing/factories";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  mockIsPending,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitForLoading,
  within,
} from "@/testing/utils";

const mockKeys = {
  items: [
    factory.sshKey({
      id: 1,
      key: "ssh-rsa aabb",
      protocol: "lp",
      auth_id: "springbokparty",
    }),
    factory.sshKey({
      id: 2,
      key: "ssh-rsa ccdd",
      protocol: "gh",
      auth_id: "springbokparty",
    }),
    factory.sshKey({
      id: 3,
      key: "ssh-rsa eeff",
      protocol: "lp",
      auth_id: "howzit",
    }),
    factory.sshKey({
      id: 4,
      key: "ssh-rsa gghh",
      protocol: "gh",
      auth_id: "springbokparty",
    }),
    factory.sshKey({
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

  it("can display errors", async () => {
    mockServer.use(
      sshKeyResolvers.listSshKeys.error({ message: "Uh oh!", code: 400 })
    );

    renderWithProviders(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
    });

    await waitForLoading();
    expect(screen.getByText("Uh oh!")).toBeInTheDocument();
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

    await waitForLoading();

    // verifies that the full value is exposed in the title attribute
    expect(screen.getByText(keyValue)).toHaveAccessibleName(keyValue);
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

    const row = screen.getAllByTestId("sshkey-row")[0];
    expect(row).not.toHaveClass("is-active");
    // Click on the delete button:
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(window.location.pathname).toBe(urls.sshKeys.delete);
  });

  it("displays a message if there are no SSH keys", async () => {
    mockServer.use(
      sshKeyResolvers.listSshKeys.handler({ items: [], total: 0 })
    );

    renderWithProviders(<SSHKeyList />, {
      route: "/account/prefs/ssh-keys",
    });

    await waitForLoading();

    expect(screen.getByText("No SSH keys available.")).toBeInTheDocument();
  });
});
