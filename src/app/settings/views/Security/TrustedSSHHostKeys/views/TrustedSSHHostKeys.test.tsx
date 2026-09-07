import type { TrustedSSHHostKeySidePanelContent } from "../constants";
import { TrustedSSHHostKeyActionSidePanelViews } from "../constants";

import TrustedSSHHostKeys from "./TrustedSSHHostKeys";

import { sshHostKeysResolvers } from "@/testing/resolvers/sshHostKeys";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitForLoading,
} from "@/testing/utils";

setupMockServer(sshHostKeysResolvers.listSshHostKeys.handler());

let mockSidePanelContent: TrustedSSHHostKeySidePanelContent | null = null;
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

describe("TrustedSSHHostKeys", () => {
  beforeEach(() => {
    mockSetSidePanelContent.mockClear();
    mockSidePanelContent = null;
  });

  it("renders the trusted SSH host keys table", async () => {
    renderWithProviders(<TrustedSSHHostKeys />);
    await waitForLoading();

    expect(
      screen.getByRole("columnheader", { name: "Host" })
    ).toBeInTheDocument();
  });

  it("renders AddTrustedSSHHostKey when view is ADD_TRUSTED_SSH_HOST_KEY", () => {
    mockSidePanelContent = {
      view: TrustedSSHHostKeyActionSidePanelViews.ADD_TRUSTED_SSH_HOST_KEY,
    };

    renderWithProviders(<TrustedSSHHostKeys />);
    expect(
      screen.getByRole("complementary", { name: "Add SSH host key" })
    ).toBeInTheDocument();
  });

  it("renders DeleteTrustedSSHHostKey when view is DELETE_TRUSTED_SSH_HOST_KEY and a valid id is provided", () => {
    mockSidePanelContent = {
      view: TrustedSSHHostKeyActionSidePanelViews.DELETE_TRUSTED_SSH_HOST_KEY,
      extras: { sshHostKeyId: 42 },
    };

    renderWithProviders(<TrustedSSHHostKeys />);
    expect(
      screen.getByRole("complementary", { name: "Delete SSH host key" })
    ).toBeInTheDocument();
  });

  it("closes the side panel form when canceled", async () => {
    mockSidePanelContent = {
      view: TrustedSSHHostKeyActionSidePanelViews.ADD_TRUSTED_SSH_HOST_KEY,
    };

    renderWithProviders(<TrustedSSHHostKeys />);
    expect(
      screen.getByRole("complementary", { name: "Add SSH host key" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockSetSidePanelContent).toHaveBeenCalledWith(null);
  });
});
