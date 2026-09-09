import { waitFor } from "@testing-library/react";

import { Details, Label as DetailsLabels } from "./Details";

import { Labels as UserFormLabels } from "@/app/settings/views/UserManagement/views/UsersList/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { usersResolvers } from "@/testing/resolvers/users";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitForLoading,
} from "@/testing/utils";

setupMockServer(
  authResolvers.authenticate.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeStatistics.handler(),
  usersResolvers.getUser.handler(),
  usersResolvers.updateUser.handler()
);

describe("Details", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      status: factory.statusState(),
    });
  });

  it("can render", () => {
    renderWithProviders(<Details />, { state });
    expect(screen.getByLabelText(DetailsLabels.Title));
  });

  it("can update the user", async () => {
    renderWithProviders(<Details />, { state });

    await waitForLoading();
    const fullname = screen.getByRole("textbox", {
      name: UserFormLabels.FullName,
    });

    await userEvent.clear(fullname);

    await userEvent.type(fullname, "Miss Wallaby");

    await userEvent.click(screen.getByRole("button", { name: "Save profile" }));

    await waitFor(() => {
      expect(usersResolvers.updateUser.resolved).toBe(true);
    });
  });
});
