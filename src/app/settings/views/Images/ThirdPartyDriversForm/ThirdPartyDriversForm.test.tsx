import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ThirdPartyDriversForm, {
  Labels as TPDFormLabels,
} from "./ThirdPartyDriversForm";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, render } from "@/testing/utils";

const mockStore = configureStore();

describe("ThirdPartyDriversForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
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
