import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import UserIntro, { Labels as UserIntroLabels } from "./UserIntro";

import * as baseHooks from "app/base/hooks/base";
import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import { actions as userActions } from "app/store/user";
import {
  authState as authStateFactory,
  sshKey as sshKeyFactory,
  sshKeyState as sshKeyStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userEventError as userEventErrorFactory,
  userState as userStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, renderWithMockStore } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("UserIntro", () => {
  let state: RootState;
  let markedIntroCompleteMock: jest.SpyInstance;
  beforeEach(() => {
    markedIntroCompleteMock = jest
      .spyOn(baseHooks, "useCycled")
      .mockImplementation(() => [false, () => null]);
    state = rootStateFactory({
      sshkey: sshKeyStateFactory({
        items: [sshKeyFactory()],
      }),
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ completed_intro: false, is_superuser: true }),
        }),
      }),
    });
  });

  it("displays a green tick icon when there are ssh keys", () => {
    renderWithBrowserRouter(<UserIntro />, {
      route: "/intro/user",
      wrapperProps: { state },
    });
    const icon = screen.getByLabelText("success");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("p-icon--success");
  });

  it("displays a grey tick icon when there are no ssh keys", async () => {
    state.sshkey.items = [];
    renderWithBrowserRouter(<UserIntro />, {
      route: "/intro/user",
      wrapperProps: { state },
    });
    const icon = screen.getByLabelText("success-grey");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("p-icon--success-grey");
  });

  it("redirects if the user has already completed the intro", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: true }),
      }),
    });
    renderWithBrowserRouter(<UserIntro />, {
      route: "/intro/user",
      wrapperProps: { state },
    });
    expect(window.location.pathname).toBe(urls.dashboard.index);
  });

  it("disables the continue button if there are no ssh keys", () => {
    state.sshkey.items = [];
    renderWithBrowserRouter(<UserIntro />, {
      route: "/intro/user",
      wrapperProps: { state },
    });
    expect(
      screen.getByRole("button", { name: UserIntroLabels.Continue })
    ).toBeDisabled();
  });

  it("hides the SSH list if there are no ssh keys", () => {
    state.sshkey.items = [];
    renderWithBrowserRouter(<UserIntro />, {
      route: "/intro/user",
      wrapperProps: { state },
    });
    expect(
      screen.queryByRole("grid", { name: "SSH keys" })
    ).not.toBeInTheDocument();
  });

  it("shows the SSH list if there are ssh keys", () => {
    renderWithBrowserRouter(<UserIntro />, {
      route: "/intro/user",
      wrapperProps: { state },
    });
    expect(screen.getByRole("grid", { name: "SSH keys" })).toBeInTheDocument();
  });

  it("marks the intro as completed when clicking the continue button", async () => {
    const store = mockStore(state);
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
      >
        <CompatRouter>
          <UserIntro />
        </CompatRouter>
      </MemoryRouter>,
      { store }
    );
    await userEvent.click(
      screen.getByRole("button", { name: UserIntroLabels.Continue })
    );
    expect(
      store
        .getActions()
        .some((action) => action.type === userActions.markIntroComplete().type)
    );
  });

  it("can show errors when trying to update the user", () => {
    state.user = userStateFactory({
      eventErrors: [userEventErrorFactory()],
    });
    renderWithBrowserRouter(<UserIntro />, {
      route: "/intro/user",
      wrapperProps: { state },
    });
    expect(screen.getByText("Error:")).toBeInTheDocument();
    expect(screen.getByText("Uh oh")).toBeInTheDocument();
  });

  it("redirects when the user has been updated", () => {
    state.user.statuses.markingIntroComplete = true;
    // Mock the markedIntroComplete state to simulate the markingIntroComplete
    // state having gone from true to false.
    markedIntroCompleteMock.mockImplementationOnce(() => [true, () => null]);
    renderWithBrowserRouter(<UserIntro />, {
      route: "/intro/user",
      wrapperProps: { state },
    });
    expect(window.location.pathname).toBe(urls.dashboard.index);
  });

  it("can skip the user setup", async () => {
    const store = mockStore(state);
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/intro/user", key: "testKey" }]}
      >
        <CompatRouter>
          <UserIntro />
        </CompatRouter>
      </MemoryRouter>,
      { store }
    );
    // Open the skip confirmation.
    await userEvent.click(
      screen.getByRole("button", { name: UserIntroLabels.Skip })
    );
    // Confirm skipping MAAS setup.
    const confirm = screen.getByTestId("skip-setup");
    expect(confirm).toBeInTheDocument();

    await userEvent.click(
      within(confirm).getByRole("button", { name: UserIntroLabels.Skip })
    );
    const expectedAction = userActions.markIntroComplete();
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });
});
