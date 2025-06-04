import type { ZoneSidePanelContent } from "@/app/zones/constants";
import { ZoneActionSidePanelViews } from "@/app/zones/constants";
import ZonesList from "@/app/zones/views/ZonesList";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  renderWithProviders,
  screen,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(
  zoneResolvers.listZones.handler(),
  zoneResolvers.getZone.handler()
);

let mockSidePanelContent: ZoneSidePanelContent | null = null;
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

describe("ZonesList", () => {
  beforeEach(() => {
    mockSetSidePanelContent.mockClear();
    mockSidePanelContent = null;
  });

  it("renders AddZone when view is CREATE_ZONE", () => {
    mockSidePanelContent = {
      view: ZoneActionSidePanelViews.CREATE_ZONE,
    };

    renderWithProviders(<ZonesList />);
    expect(
      screen.getByRole("complementary", { name: "Add AZ" })
    ).toBeInTheDocument();
  });

  it("renders EditZone when view is EDIT_ZONE and a valid zoneId is provided", () => {
    mockSidePanelContent = {
      view: ZoneActionSidePanelViews.EDIT_ZONE,
      extras: { zoneId: 42 },
    };

    renderWithProviders(<ZonesList />);
    expect(
      screen.getByRole("complementary", { name: "Edit AZ" })
    ).toBeInTheDocument();
  });

  it("renders DeleteZone when view is DELETE_ZONE and a valid zoneId is provided", () => {
    mockSidePanelContent = {
      view: ZoneActionSidePanelViews.DELETE_ZONE,
      extras: { zoneId: 42 },
    };

    renderWithProviders(<ZonesList />, { state: {} });
    expect(
      screen.getByRole("complementary", { name: "Delete AZ" })
    ).toBeInTheDocument();
  });

  it("closes side panel form when canceled", async () => {
    mockSidePanelContent = {
      view: ZoneActionSidePanelViews.CREATE_ZONE,
    };

    renderWithProviders(<ZonesList />);
    expect(
      screen.getByRole("complementary", { name: "Add AZ" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockSetSidePanelContent).toHaveBeenCalledWith(null);
  });
});
