import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
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

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <FormikForm initialValues={{}} onSubmit={jest.fn()}>
            Content
          </FormikForm>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Formik").exists()).toBe(true);
  });
});
