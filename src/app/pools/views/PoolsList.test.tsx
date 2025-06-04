import type { PoolSidePanelContent } from "@/app/pools/constants";
import { PoolActionSidePanelViews } from "@/app/pools/constants";
import PoolsList from "@/app/pools/views/PoolsList";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  renderWithProviders,
  screen,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(
  poolsResolvers.listPools.handler(),
  poolsResolvers.getPool.handler()
);

let mockSidePanelContent: PoolSidePanelContent | null = null;
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

describe("PoolsList", () => {
  beforeEach(() => {
    mockSetSidePanelContent.mockClear();
    mockSidePanelContent = null;
  });

  it("renders AddPool when view is CREATE_POOL", () => {
    mockSidePanelContent = {
      view: PoolActionSidePanelViews.CREATE_POOL,
    };

    renderWithProviders(<PoolsList />);
    expect(
      screen.getByRole("complementary", { name: "Add pool" })
    ).toBeInTheDocument();
  });

  it("renders EditPool when view is EDIT_POOL and a valid poolId is provided", () => {
    mockSidePanelContent = {
      view: PoolActionSidePanelViews.EDIT_POOL,
      extras: { poolId: 42 },
    };

    renderWithProviders(<PoolsList />);
    expect(
      screen.getByRole("complementary", { name: "Edit pool" })
    ).toBeInTheDocument();
  });

  it("renders DeletePool when view is DELETE_POOL and a valid poolId is provided", () => {
    mockSidePanelContent = {
      view: PoolActionSidePanelViews.DELETE_POOL,
      extras: { poolId: 42 },
    };

    renderWithProviders(<PoolsList />);
    expect(
      screen.getByRole("complementary", { name: "Delete pool" })
    ).toBeInTheDocument();
  });

  it("closes side panel form when canceled", async () => {
    mockSidePanelContent = {
      view: PoolActionSidePanelViews.CREATE_POOL,
    };

    renderWithProviders(<PoolsList />);
    expect(
      screen.getByRole("complementary", { name: "Add pool" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockSetSidePanelContent).toHaveBeenCalledWith(null);
  });
});
