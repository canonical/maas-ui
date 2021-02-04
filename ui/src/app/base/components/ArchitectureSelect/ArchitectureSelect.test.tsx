import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ArchitectureSelect from "./ArchitectureSelect";

import {
  architecturesState as architecturesStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ArchitectureSelect", () => {
  it("renders a list of all architectures in state", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          data: ["arch1", "arch2", "arch3"],
          loaded: true,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ architecture: "" }} onSubmit={jest.fn()}>
          <ArchitectureSelect name="architecture" />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("select[name='architecture']")).toMatchSnapshot();
  });

  it("dispatches action to fetch architectures on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <Formik initialValues={{ architecture: "" }} onSubmit={jest.fn()}>
          <ArchitectureSelect name="architecture" />
        </Formik>
      </Provider>
    );

    expect(
      store
        .getActions()
        .some((action) => action.type === "FETCH_GENERAL_ARCHITECTURES")
    ).toBe(true);
  });

  it("disables select if architectures have not loaded", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          loaded: false,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ architecture: "" }} onSubmit={jest.fn()}>
          <ArchitectureSelect name="architecture" />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("select[name='architecture']").prop("disabled")).toBe(
      true
    );
  });
});
