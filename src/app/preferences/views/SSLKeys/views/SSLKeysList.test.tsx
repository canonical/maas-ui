import type { SSLKeySidePanelContent } from "@/app/preferences/views/SSLKeys/constants";
import { SSLKeyActionSidePanelViews } from "@/app/preferences/views/SSLKeys/constants";
import SSLKeysList from "@/app/preferences/views/SSLKeys/views/SSLKeysList";
import { sslKeyResolvers } from "@/testing/resolvers/sslKeys";
import {
  renderWithProviders,
  screen,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(sslKeyResolvers.listSslKeys.handler());

let mockSidePanelContent: SSLKeySidePanelContent | null = null;
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

describe("SSLKeysList", () => {
  beforeEach(() => {
    mockSetSidePanelContent.mockClear();
    mockSidePanelContent = null;
  });

  it("renders AddSSLKey when view is ADD_SSL_KEY", () => {
    mockSidePanelContent = {
      view: SSLKeyActionSidePanelViews.ADD_SSL_KEY,
    };

    renderWithProviders(<SSLKeysList />);
    expect(
      screen.getByRole("complementary", { name: "Add SSL key" })
    ).toBeInTheDocument();
  });

  it("renders DeleteSSLKey when view is DELETE_SSL_KEY and valid sslKeyIds are provided", () => {
    mockSidePanelContent = {
      view: SSLKeyActionSidePanelViews.DELETE_SSL_KEY,
      extras: { sslKeyId: 42 },
    };

    renderWithProviders(<SSLKeysList />);
    expect(
      screen.getByRole("complementary", { name: "Delete SSL key" })
    ).toBeInTheDocument();
  });

  it("closes side panel form when canceled", async () => {
    mockSidePanelContent = {
      view: SSLKeyActionSidePanelViews.ADD_SSL_KEY,
    };

    renderWithProviders(<SSLKeysList />);
    expect(
      screen.getByRole("complementary", { name: "Add SSL key" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockSetSidePanelContent).toHaveBeenCalledWith(null);
  });
});
