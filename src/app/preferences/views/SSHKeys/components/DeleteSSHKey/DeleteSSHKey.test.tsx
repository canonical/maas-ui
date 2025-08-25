import { vi } from "vitest";

import DeleteSSHKey from "@/app/preferences/views/SSHKeys/components/DeleteSSHKey/DeleteSSHKey";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(sshKeyResolvers.deleteSshKey.handler());
const mockUseSidePanel = vi.spyOn(
  await import("@/app/base/side-panel-context-new"),
  "useSidePanel"
);

describe("DeleteSSHKey", () => {
  const mockClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSidePanel.mockReturnValue({
      isOpen: false,
      title: "",
      size: "regular",
      component: null,
      props: {},
      open: vi.fn(),
      close: mockClose,
      setSize: vi.fn(),
    });
  });

  it("renders", () => {
    renderWithProviders(<DeleteSSHKey ids={[2, 3]} />);
    expect(
      screen.getByRole("form", { name: "Confirm SSH key deletion" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete these SSH keys?")
    ).toBeInTheDocument();
  });

  it("calls closeForm on cancel click", async () => {
    renderWithProviders(<DeleteSSHKey ids={[2]} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("can delete a group of SSH keys", async () => {
    renderWithProviders(<DeleteSSHKey ids={[2, 3]} />);
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(sshKeyResolvers.deleteSshKey.resolved).toBeTruthy();
    });
  });

  it("can show errors encountered when deleting SSH keys", async () => {
    mockServer.use(
      sshKeyResolvers.deleteSshKey.error({ message: "Uh oh!", code: 404 })
    );
    renderWithProviders(<DeleteSSHKey ids={[2, 3]} />);

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });
});
