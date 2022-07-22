import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Labels as TPDFormLabels } from "../ThirdPartyDriversForm/ThirdPartyDriversForm";

import ThirdPartyDrivers, { Labels as TPDLabels } from "./ThirdPartyDrivers";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ThirdPartyDrivers", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.ENABLE_THIRD_PARTY_DRIVERS,
            value: false,
          }),
        ],
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
            <ThirdPartyDrivers />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(TPDLabels.Loading)).toBeInTheDocument();
  });

  it("displays the ThirdPartyDrivers form if config is loaded", () => {
    state.config.loaded = true;
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ThirdPartyDrivers />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("form", { name: TPDFormLabels.FormLabel })
    ).toBeInTheDocument();
  });
});
