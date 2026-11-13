import { waitFor } from "@testing-library/react";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import UsersList from "@/app/settings/views/UserManagement/views/UsersList";
import { DeleteUser } from "@/app/settings/views/UserManagement/views/UsersList/components";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { usersResolvers } from "@/testing/resolvers/users";
import {
  mockModal,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  within,
} from "@/testing/utils";

const mockServer = setupMockServer(
  usersResolvers.listUsers.handler(),
  usersResolvers.getUser.handler(),
  usersResolvers.listUsersStatistics.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  authResolvers.getMeStatistics.handler()
);
const { mockOpen: mockOpenModal } = await mockModal();

describe("UsersList", () => {
  const state = factory.rootState({
    status: factory.statusState(),
  });

  it("renders AddUser", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(factory.user({ id: 1 })),
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_EDIT_IDENTITIES,
        }),
      ])
    );
    renderWithProviders(<UsersList />, { state });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add user" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Add user" }));
    expect(
      screen.getByRole("complementary", { name: "Add user" })
    ).toBeInTheDocument();
  });

  it("renders EditUser when a valid userId is provided", async () => {
    mockServer.use(
      usersResolvers.listUsers.handler({
        items: [
          factory.user({ id: 1, username: "current-user" }),
          factory.user({ id: 2, username: "other-user" }),
        ],
        total: 2,
      }),
      authResolvers.getCurrentUser.handler(factory.user({ id: 1 })),
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_EDIT_IDENTITIES,
        }),
      ])
    );
    renderWithProviders(<UsersList />, { state });
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
        "href",
        "/account/prefs/details"
      );
      expect(
        screen.queryByLabelText("Loading machines count")
      ).not.toBeInTheDocument();
      expect(
        within(screen.getByRole("row", { name: /other-user/ })).getByRole(
          "button",
          { name: "Edit" }
        )
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(
      within(screen.getByRole("row", { name: /other-user/ })).getByRole(
        "button",
        { name: "Edit" }
      )
    );
    expect(
      screen.getByRole("complementary", { name: "Edit user" })
    ).toBeInTheDocument();
  });

  it("renders DeleteUser when a valid userId is provided", async () => {
    mockServer.use(
      usersResolvers.listUsers.handler({
        items: [
          factory.user({ id: 1, username: "current-user" }),
          factory.user({ id: 2, username: "other-user" }),
        ],
        total: 2,
      }),
      authResolvers.getCurrentUser.handler(factory.user({ id: 1 })),
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_EDIT_IDENTITIES,
        }),
      ])
    );
    renderWithProviders(<UsersList />, { state });
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
        "href",
        "/account/prefs/details"
      );
      expect(
        screen.queryByLabelText("Loading machines count")
      ).not.toBeInTheDocument();
      expect(
        within(screen.getByRole("row", { name: /other-user/ })).getByRole(
          "button",
          { name: "Delete" }
        )
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(
      within(screen.getByRole("row", { name: /other-user/ })).getByRole(
        "button",
        { name: "Delete" }
      )
    );
    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({
        component: DeleteUser,
        title: "Delete user",
        props: { id: 2 },
      })
    );
  });

  it("closes side panel form when canceled", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(factory.user({ id: 1 })),
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_EDIT_IDENTITIES,
        }),
      ])
    );
    renderWithProviders(<UsersList />, { state });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add user" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Add user" }));
    expect(
      screen.getByRole("complementary", { name: "Add user" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(
      screen.queryByRole("complementary", { name: "Add user" })
    ).not.toBeInTheDocument();
  });
});
