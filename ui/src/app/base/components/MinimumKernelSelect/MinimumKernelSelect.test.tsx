import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import MinimumKernelSelect from "./MinimumKernelSelect";

import {
  hweKernelsState as hweKernelsStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MinimumKernelSelect", () => {
  it("renders a list of all hwe kernels in state", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        hweKernels: hweKernelsStateFactory({
          data: [
            ["kernel-1", "Kernel 1"],
            ["kernel-2", "Kernel 2"],
          ],
          loaded: true,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ minKernel: "" }} onSubmit={jest.fn()}>
          <MinimumKernelSelect name="minKernel" />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("select[name='minKernel']")).toMatchSnapshot();
  });

  it("dispatches action to fetch hwe kernels on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <Formik initialValues={{ minKernel: "" }} onSubmit={jest.fn()}>
          <MinimumKernelSelect name="minKernel" />
        </Formik>
      </Provider>
    );

    expect(
      store
        .getActions()
        .some((action) => action.type === "FETCH_GENERAL_HWE_KERNELS")
    ).toBe(true);
  });

  it("disables select if hwe kernels have not loaded", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        hweKernels: hweKernelsStateFactory({
          loaded: false,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ minKernel: "" }} onSubmit={jest.fn()}>
          <MinimumKernelSelect name="minKernel" />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("select[name='minKernel']").prop("disabled")).toBe(
      true
    );
  });
});
