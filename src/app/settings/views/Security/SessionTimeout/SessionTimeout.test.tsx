import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import SessionTimeout, {
  Labels as SessionTimeoutLabels,
} from "./SessionTimeout";

import { actions as configActions } from "app/store/config";
import type { RootState } from "app/store/root/types";
import { renderWithBrowserRouter, getTestState } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("SessionTimeout", () => {
  let state: RootState;

  beforeEach(() => {
    state = getTestState();
  });

  it("displays a spinner while loading", () => {
    state.config.loaded = false;
    state.config.loading = true;
    renderWithBrowserRouter(<SessionTimeout />, { state });

    expect(screen.getByText(SessionTimeoutLabels.Loading)).toBeInTheDocument();
  });

  it("displays the form when the 'Edit' button is clicked", async () => {
    renderWithBrowserRouter(<SessionTimeout />, { state });

    expect(
      screen.getByRole("form", {
        name: SessionTimeoutLabels.ConfigureSessionTimeout,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    ).toHaveValue("14 days");
  });

  it("displays the updated timeout length when the value is saved", async () => {
    renderWithBrowserRouter(<SessionTimeout />, { state });

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "3 hours"
    );

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    );

    expect(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    ).toHaveValue("3 hours");
  });

  it("disables the submit button if an invalid value is entered", async () => {
    renderWithBrowserRouter(<SessionTimeout />, { state });

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "randomtext"
    );

    expect(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    ).toBeDisabled();

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "2hrs 3mins"
    );

    expect(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    ).toBeDisabled();

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "20 weeks and 12 nanoseconds"
    );

    expect(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    ).toBeDisabled();
  });

  it("correctly converts time values to seconds and dispatches an action to update the session timeout on save", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SessionTimeout />, { store });

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "1 week 5 days 2 hours"
    );

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    );

    const actualActions = store.getActions();
    const expectedAction = configActions.update({
      session_length: 1044000,
    });

    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
