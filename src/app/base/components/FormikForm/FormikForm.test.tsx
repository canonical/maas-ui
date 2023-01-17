import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import FormikForm from "./FormikForm";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("FormikForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: ConfigNames.ENABLE_ANALYTICS, value: false }),
        ],
      }),
    });
  });
  it("can render a form", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <FormikForm
              aria-label="example"
              initialValues={{}}
              onSubmit={jest.fn()}
            >
              Content
            </FormikForm>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("form", { name: "example" })).toBeInTheDocument();
  });
});
