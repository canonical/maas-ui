import { waitFor } from "@testing-library/react";

import { Details, Label as DetailsLabels } from "./Details";

import { Labels as UserFormLabels } from "@/app/settings/views/Users/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userResolvers } from "@/testing/resolvers/users";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
  waitForLoading,
} from "@/testing/utils";

setupMockServer(
  userResolvers.getThisUser.handler(),
  userResolvers.getUser.handler(),
  userResolvers.updateUser.handler(),
  userResolvers.authenticate.handler()
);

describe("Details", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      status: factory.statusState({
        externalAuthURL: null,
      }),
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

    await waitFor(() => expect(userResolvers.updateUser.resolved).toBe(true));
  });

  it("shows a message when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    renderWithProviders(<Details />, { state });
    expect(
      screen.getByText(
        "Users for this MAAS are managed using an external service"
      )
    );
  });
});
