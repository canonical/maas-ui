import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import FormikForm from "./FormikForm";

import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("FormikForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "analytics_enabled", value: false })],
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
              initialValues={{}}
              onSubmit={jest.fn()}
              aria-label="example"
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
