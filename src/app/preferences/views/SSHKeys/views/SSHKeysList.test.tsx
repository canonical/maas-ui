import type { SSHKeySidePanelContent } from "@/app/preferences/views/SSHKeys/constants";
import { SSHKeyActionSidePanelViews } from "@/app/preferences/views/SSHKeys/constants";
import SSHKeysList from "@/app/preferences/views/SSHKeys/views/SSHKeysList";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  renderWithProviders,
  screen,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(sshKeyResolvers.listSshKeys.handler());

let mockSidePanelContent: SSHKeySidePanelContent | null = null;
const mockSetSidePanelContent = vi.fn();

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: () => ({
      sidePanelContent: mockSidePanelContent,
      setSidePanelContent: mockSetSidePanelContent,
      sidePanelSize: "regular",
      setSidePanelSize: vi.fn(),
    }),
  };
});

describe("SSHKeysList", () => {
  beforeEach(() => {
    mockSetSidePanelContent.mockClear();
    mockSidePanelContent = null;
  });

  it("renders AddSSHKey when view is ADD_SSH_KEY", () => {
    mockSidePanelContent = {
      view: SSHKeyActionSidePanelViews.ADD_SSH_KEY,
    };

    renderWithProviders(<SSHKeysList />);
    expect(
      screen.getByRole("complementary", { name: "Add SSH key" })
    ).toBeInTheDocument();
  });

  it("renders DeleteSSHKey when view is DELETE_SSH_KEY and valid sshKeyIds are provided", () => {
    mockSidePanelContent = {
      view: SSHKeyActionSidePanelViews.DELETE_SSH_KEY,
      extras: { sshKeyIds: [42] },
    };

    renderWithProviders(<SSHKeysList />);
    expect(
      screen.getByRole("complementary", { name: "Delete SSH key" })
    ).toBeInTheDocument();
  });

  it("closes side panel form when canceled", async () => {
    mockSidePanelContent = {
      view: SSHKeyActionSidePanelViews.ADD_SSH_KEY,
    };

    renderWithProviders(<SSHKeysList />);
    expect(
      screen.getByRole("complementary", { name: "Add SSH key" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockSetSidePanelContent).toHaveBeenCalledWith(null);
  });
});
