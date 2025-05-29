import * as sidePanelHooks from "@/app/base/side-panel-context";
import { PreferenceSidePanelViews } from "@/app/preferences/constants";
import DeleteSSHKey from "@/app/preferences/views/SSHKeys/components/DeleteSSHKey/DeleteSSHKey";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  renderWithBrowserRouter,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(sshKeyResolvers.deleteSshKey.handler());

describe("DeleteSSHKey", () => {
  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent: vi.fn(),
      sidePanelContent: {
        view: PreferenceSidePanelViews.DELETE_SSH_KEYS,
      },
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
  });

  it("renders", () => {
    renderWithBrowserRouter(<DeleteSSHKey closeForm={vi.fn()} ids={[2, 3]} />);
    expect(
      screen.getByRole("form", { name: "Delete SSH key confirmation" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete these SSH keys?")
    ).toBeInTheDocument();
  });

  it("can delete a group of SSH keys", async () => {
    renderWithBrowserRouter(<DeleteSSHKey closeForm={vi.fn()} ids={[2, 3]} />);
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(sshKeyResolvers.deleteSshKey.resolved).toBeTruthy();
    });
  });

  it("can show errors encountered when deleting SSH keys", async () => {
    mockServer.use(
      sshKeyResolvers.deleteSshKey.error({ message: "Uh oh!", code: 404 })
    );
    renderWithBrowserRouter(<DeleteSSHKey closeForm={vi.fn()} ids={[2, 3]} />);

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });
});
