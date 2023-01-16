import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import WindowsForm, { Labels as WindowsFormLabels } from "./WindowsForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, render } from "testing/utils";

const mockStore = configureStore();

describe("WindowsForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        loading: false,
        loaded: true,
        items: [
          {
            name: ConfigNames.WINDOWS_KMS_HOST,
            value: "127.0.0.1",
          },
        ],
      }),
    });
  });

  it("sets windows_kms_host value", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <WindowsForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("textbox", { name: WindowsFormLabels.KMSHostLabel })
    ).toHaveValue("127.0.0.1");
  });
});
