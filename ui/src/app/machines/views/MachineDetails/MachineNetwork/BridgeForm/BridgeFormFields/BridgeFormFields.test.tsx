import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import BridgeFormFields from "./BridgeFormFields";

import { rootState as rootStateFactory } from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("BridgeFormFields", () => {
  it("does not display the fd field if stp isn't on", async () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <BridgeFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikField[name='bridge_fd']").exists()).toBe(false);
  });

  it("displays the fd field if stp is on", async () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <BridgeFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("input[name='bridge_stp']").simulate("change", {
      target: {
        name: "bridge_stp",
        value: true,
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField[name='bridge_fd']").exists()).toBe(true);
  });
});
