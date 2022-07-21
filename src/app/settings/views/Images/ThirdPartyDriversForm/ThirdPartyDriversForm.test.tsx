import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ThirdPartyDriversForm, {
  Labels as TPDFormLabels,
} from "./ThirdPartyDriversForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ThirdPartyDriversForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          {
            name: ConfigNames.ENABLE_THIRD_PARTY_DRIVERS,
            value: true,
          },
        ],
      }),
    });
  });

  it("sets enable_third_party_drivers value", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <ThirdPartyDriversForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("checkbox", { name: TPDFormLabels.CheckboxLabel })
    ).toHaveProperty("checked", true);
  });
});
