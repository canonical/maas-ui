import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import GeneralForm from "./GeneralForm";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, render } from "@/testing/utils";

const mockStore = configureStore();

describe("GeneralForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({ name: ConfigNames.MAAS_NAME, value: "bionic-maas" }),
          factory.config({ name: ConfigNames.THEME, value: "default" }),
          factory.config({ name: ConfigNames.ENABLE_ANALYTICS, value: true }),
          factory.config({
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

    expect(
      screen.getByRole("form", { name: "Configuration - General" })
    ).toBeInTheDocument();
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
    window.usabilla_live = vi.fn();
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
