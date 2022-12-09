import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import SessionTimeout, {
  Labels as SessionTimeoutLabels,
} from "./SessionTimeout";

import { actions as configActions } from "app/store/config";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("SessionTimeout", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory()],
      }),
      general: generalStateFactory(),
    });
  });

  it("displays a spinner while loading", () => {
    renderWithMockStore(<SessionTimeout />, { state });

    expect(screen.getByText(SessionTimeoutLabels.Loading)).toBeInTheDocument();
  });

  it("shows the current value in read-only mode by default", () => {
    renderWithMockStore(<SessionTimeout />, { state });

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
    renderWithMockStore(<SessionTimeout />, { state });

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
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    ).toHaveValue("14");
  });

  it("hides the form when the 'Cancel' button is clicked", async () => {
    renderWithMockStore(<SessionTimeout />, { state });

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

    expect(screen.getByText(/3 days/)).toBeInTheDocument();
  });

  it("displays the updated timeout length when the value is saved", async () => {
    renderWithMockStore(<SessionTimeout />, { state });

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Edit })
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
      "3"
    );

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Save })
    );
  });

  it("correctly converts days values to seconds and dispatches an action to update the session timeout on save", async () => {
    const store = mockStore(state);
    renderWithMockStore(<SessionTimeout />, { store });

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Edit })
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
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
    renderWithMockStore(<SessionTimeout />, { store });

    await userEvent.click(
      screen.getByRole("button", { name: SessionTimeoutLabels.Edit })
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration })
    );

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: SessionTimeoutLabels.TimeUnit }),
      "hours"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: SessionTimeoutLabels.Expiration }),
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
