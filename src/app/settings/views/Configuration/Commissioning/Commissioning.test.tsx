import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { Labels as CommissioningFormLabels } from "../CommissioningForm/CommissioningForm";

import Commissioning, { Labels as CommissioningLabels } from "./Commissioning";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, render } from "@/testing/utils";

const mockStore = configureStore();

describe("Commissioning", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          {
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "bionic",
            choices: [],
          },
          {
            name: ConfigNames.DEFAULT_MIN_HWE_KERNEL,
            value: "ga-16.04-lowlatency",
            choices: [],
          },
        ],
      }),
      general: factory.generalState({
        osInfo: factory.osInfoState({
          loaded: true,
        }),
      }),
    });
  });

  it("displays a spinner if config is loading", () => {
    state.config.loading = true;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <Commissioning />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(CommissioningLabels.Loading)).toBeInTheDocument();
  });

  it("displays the Commissioning form if config is loaded", () => {
    state.config.loaded = true;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <Commissioning />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("form", { name: CommissioningFormLabels.FormLabel })
    ).toBeInTheDocument();
  });

  it(`dispatches actions to fetch config and general os info if either has not
    already loaded`, () => {
    state.config.loaded = false;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <Commissioning />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter(
        (action) =>
          action.type.startsWith("config/fetch") ||
          action.type.startsWith("general/fetch")
      );

    expect(fetchActions).toEqual([
      {
        type: "config/fetch",
        meta: { model: "config", method: "list" },
        payload: null,
      },
      {
        type: "general/fetchOsInfo",
        meta: {
          cache: true,
          model: "general",
          method: "osinfo",
        },
        payload: null,
      },
    ]);
  });
});
