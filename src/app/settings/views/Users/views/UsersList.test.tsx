import type { UserSidePanelContent } from "@/app/settings/views/Users/constants";
import { UserActionSidePanelViews } from "@/app/settings/views/Users/constants";
import UsersList from "@/app/settings/views/Users/views/UsersList";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { usersResolvers } from "@/testing/resolvers/users";
import {
  renderWithProviders,
  screen,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(
  usersResolvers.listUsers.handler(),
  usersResolvers.getUser.handler(),
  authResolvers.getCurrentUser.handler()
);

let mockSidePanelContent: UserSidePanelContent | null = null;
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

describe("UsersList", () => {
  const state = factory.rootState({
    status: factory.statusState({ externalAuthURL: null }),
  });
  beforeEach(() => {
    mockSetSidePanelContent.mockClear();
    mockSidePanelContent = null;
  });

  it("renders AddUser when view is CREATE_USER", () => {
    mockSidePanelContent = {
      view: UserActionSidePanelViews.CREATE_USER,
    };

    renderWithProviders(<UsersList />, { state });
    expect(
      screen.getByRole("complementary", { name: "Add user" })
    ).toBeInTheDocument();
  });

  it("renders EditUser when view is EDIT_USER", () => {
    mockSidePanelContent = {
      view: UserActionSidePanelViews.EDIT_USER,
      extras: { userId: 42 },
    };

    renderWithProviders(<UsersList />, { state });
    expect(
      screen.getByRole("complementary", { name: "Edit user" })
    ).toBeInTheDocument();
  });

  it("renders DeleteUser when view is DELETE_USER and valid sshKeyIds are provided", () => {
    mockSidePanelContent = {
      view: UserActionSidePanelViews.DELETE_USER,
      extras: { userId: 42 },
    };

    renderWithProviders(<UsersList />, { state });
    expect(
      screen.getByRole("complementary", { name: "Delete user" })
    ).toBeInTheDocument();
  });

  it("closes side panel form when canceled", async () => {
    mockSidePanelContent = {
      view: UserActionSidePanelViews.CREATE_USER,
    };

    renderWithProviders(<UsersList />, { state });
    expect(
      screen.getByRole("complementary", { name: "Add user" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockSetSidePanelContent).toHaveBeenCalledWith(null);
  });
});
