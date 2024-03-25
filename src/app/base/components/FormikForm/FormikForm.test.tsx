import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FormikForm from "./FormikForm";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("FormikForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({ name: ConfigNames.ENABLE_ANALYTICS, value: false }),
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
              onSubmit={vi.fn()}
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
