import DeleteSSHKey from "./DeleteSSHKey";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { PreferenceSidePanelViews } from "@/app/preferences/constants";
import * as factory from "@/testing/factories";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const keys = [
  factory.sshKeyV3({
    id: 1,
    key: "ssh-rsa aabb",
    protocol: "lp",
    auth_id: "koalaparty",
  }),
  factory.sshKeyV3({
    id: 2,
    key: "ssh-rsa ccdd",
    protocol: "gh",
    auth_id: "koalaparty",
  }),
  factory.sshKeyV3({
    id: 3,
    key: "ssh-rsa eeff",
    protocol: "lp",
    auth_id: "maaate",
  }),
  factory.sshKeyV3({
    id: 4,
    key: "ssh-rsa gghh",
    protocol: "gh",
    auth_id: "koalaparty",
  }),
  factory.sshKeyV3({ id: 5, key: "ssh-rsa gghh" }),
];

const mockServer = setupMockServer(sshKeyResolvers.deleteSshKey.handler());

describe("DeleteSSHKey", () => {
  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent: vi.fn(),
      sidePanelContent: {
        view: PreferenceSidePanelViews.DELETE_SSH_KEYS,
        extras: { group: { keys } },
      },
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
  });

  it("renders", () => {
    renderWithProviders(<DeleteSSHKey />, {
      route: "/account/prefs/ssh-keys/delete?ids=2,3",
    });
    expect(
      screen.getByRole("form", { name: "Delete SSH key confirmation" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete these SSH keys?")
    ).toBeInTheDocument();
  });

  it("can delete a group of SSH keys", async () => {
    renderWithProviders(<DeleteSSHKey />, {
      route: "/account/prefs/ssh-keys/delete?ids=2,3",
    });
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(sshKeyResolvers.deleteSshKey.resolved).toBeTruthy();
    });
  });

  it("can show errors encountered when deleting SSH keys", async () => {
    mockServer.use(
      sshKeyResolvers.deleteSshKey.error({ message: "Uh oh!", code: 404 })
    );
    renderWithProviders(<DeleteSSHKey />, {
      route: "/account/prefs/ssh-keys/delete?ids=2,3",
    });

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });
});
