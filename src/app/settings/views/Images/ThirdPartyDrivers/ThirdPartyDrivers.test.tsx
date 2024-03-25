import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { Labels as TPDFormLabels } from "../ThirdPartyDriversForm/ThirdPartyDriversForm";

import ThirdPartyDrivers, { Labels as TPDLabels } from "./ThirdPartyDrivers";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, render } from "@/testing/utils";

const mockStore = configureStore();

describe("ThirdPartyDrivers", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
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
