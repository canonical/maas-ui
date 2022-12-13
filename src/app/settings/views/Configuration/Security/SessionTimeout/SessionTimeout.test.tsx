import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import SessionTimeout, {
  Labels as SessionTimeoutLabels,
} from "./SessionTimeout";

import { actions as configActions } from "app/store/config";
import type { RootState } from "app/store/root/types";
import { getTestState, renderWithBrowserRouter } from "testing/utils";

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

  it("shows the current value in read-only mode by default", () => {
    renderWithBrowserRouter(<SessionTimeout />, { state });

    expect(
      screen.queryByText(SessionTimeoutLabels.Loading)
    ).not.toBeInTheDocument();

    expect(screen.getByText(/14 days/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: SessionTimeoutLabels.Edit })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("form", {
        name: SessionTimeoutLabels.ConfigureSessionTimeout,
      })
    ).not.toBeInTheDocument();
  });

  it("displays the form when the 'Edit' button is clicked", async () => {
    renderWithBrowserRouter(<SessionTimeout />, { state });

    expect(
      screen.queryByRole("form", {
        name: SessionTimeoutLabels.ConfigureSessionTimeout,
      })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Edit })
    );

    expect(
      screen.getByRole("form", {
        name: SessionTimeoutLabels.ConfigureSessionTimeout,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("spinbutton", { name: SessionTimeoutLabels.Expiration })
    ).toHaveValue(336);

    expect(
      screen.getByRole("combobox", { name: SessionTimeoutLabels.TimeUnit })
    ).toHaveValue("hours");
  });

  it("hides the form when the 'Cancel' button is clicked", async () => {
    renderWithBrowserRouter(<SessionTimeout />, { state });

    expect(
      screen.queryByRole("form", {
        name: SessionTimeoutLabels.ConfigureSessionTimeout,
      })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Edit })
    );

    expect(
      screen.getByRole("form", {
        name: SessionTimeoutLabels.ConfigureSessionTimeout,
      })
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Cancel })
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("form", {
          name: SessionTimeoutLabels.ConfigureSessionTimeout,
        })
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText(/14 days/)).toBeInTheDocument();
  });

  it("displays the updated timeout length when the value is saved", async () => {
    renderWithBrowserRouter(<SessionTimeout />, { state });

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Edit })
    );

    await userEvent.clear(
      screen.getByRole("spinbutton", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.type(
      screen.getByRole("spinbutton", { name: SessionTimeoutLabels.Expiration }),
      "3"
    );

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    );
  });

  it("correctly converts days values to seconds and dispatches an action to update the session timeout on save", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SessionTimeout />, { store });

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Edit })
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: SessionTimeoutLabels.TimeUnit }),
      "days"
    );

    await userEvent.clear(
      screen.getByRole("spinbutton", { name: SessionTimeoutLabels.Expiration })
    );
    await userEvent.type(
      screen.getByRole("spinbutton", { name: SessionTimeoutLabels.Expiration }),
      "3"
    );
    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    );

    const actualActions = store.getActions();
    const expectedAction = configActions.update({
      session_length: 259200,
    });

    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("correctly converts hours values to seconds and dispatches an action to update the session timeout on save", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<SessionTimeout />, { store });

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Edit })
    );

    await userEvent.clear(
      screen.getByRole("spinbutton", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: SessionTimeoutLabels.TimeUnit }),
      "hours"
    );

    await userEvent.type(
      screen.getByRole("spinbutton", { name: SessionTimeoutLabels.Expiration }),
      "3"
    );
    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    );

    const actualActions = store.getActions();
    const expectedAction = configActions.update({
      session_length: 10800,
    });

    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
