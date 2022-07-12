import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import GeneralForm from "./GeneralForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("GeneralForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: ConfigNames.MAAS_NAME, value: "bionic-maas" }),
          configFactory({ name: ConfigNames.THEME, value: "default" }),
          configFactory({ name: ConfigNames.ENABLE_ANALYTICS, value: true }),
          configFactory({
            name: ConfigNames.RELEASE_NOTIFICATIONS,
            value: true,
          }),
        ],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Form doesn't have a title, but the save button is within the form
    // So by testing that this is in the document, we can know if the form is there
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("sets maas_name value", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("textbox", { name: "MAAS name" })).toHaveValue(
      "bionic-maas"
    );
  });

  it("sets theme value", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("radio", {
        name: "Default",
      })
    ).toHaveProperty("checked", true);
  });

  it("sets enable_analytics value", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Enable analytics to shape improvements to user experience",
      })
    ).toHaveProperty("checked", true);
  });

  it("sets release_notifications value", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("checkbox", {
        name: "Enable new release notifications",
      })
    ).toHaveProperty("checked", true);
  });

  it("can change the MAAS theme colour", async () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const redRadioButton = screen.getByRole("radio", { name: "Red" });
    const saveButton = screen.getByRole("button", { name: "Save" });

    await userEvent.click(redRadioButton);
    await userEvent.click(saveButton);

    expect(redRadioButton).toHaveProperty("checked", true);
  });

  it("can trigger usabilla when the notifications are turned off", async () => {
    const store = mockStore(state);
    window.usabilla_live = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <GeneralForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const release_notifications_checkbox = screen.getByRole("checkbox", {
      name: "Enable new release notifications",
    });

    const saveButton = screen.getByRole("button", { name: "Save" });

    await userEvent.click(release_notifications_checkbox);
    await userEvent.click(saveButton);

    expect(window.usabilla_live).toHaveBeenCalled();
  });
});
