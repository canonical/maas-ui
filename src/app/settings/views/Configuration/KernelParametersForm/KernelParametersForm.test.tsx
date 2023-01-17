import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import KernelParametersForm, {
  Labels as FormLabels,
} from "./KernelParametersForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, render } from "testing/utils";

const mockStore = configureStore();

describe("KernelParametersForm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        items: [
          {
            name: ConfigNames.KERNEL_OPTS,
            value: "foo",
          },
        ],
      }),
    });
  });

  it("sets kernel_opts value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <KernelParametersForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("textbox", {
        name: FormLabels.GlobalBootParams,
      })
    ).toHaveValue("foo");
  });
});
