import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import FabricSelect from "./FabricSelect";

import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("FabricSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [],
        loaded: true,
      }),
    });
  });

  it("shows a spinner if the fabrics haven't loaded", () => {
    state.fabric.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
          <FabricSelect name="fabric" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the fabric options", () => {
    const items = [
      fabricFactory({ id: 1, name: "FABric1" }),
      fabricFactory({ id: 2, name: "FABric2" }),
    ];
    state.fabric.items = items;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
          <FabricSelect name="fabric" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      { label: "Select fabric", value: "" },
      {
        label: items[0].name,
        value: items[0].id.toString(),
      },
      {
        label: items[1].name,
        value: items[1].id.toString(),
      },
    ]);
  });

  it("can display a default option", () => {
    const store = mockStore(state);
    const defaultOption = {
      label: "Default",
      value: "99",
    };
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
          <FabricSelect name="fabric" defaultOption={defaultOption} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")[0]).toStrictEqual(
      defaultOption
    );
  });

  it("can hide the default option", () => {
    state.fabric.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
          <FabricSelect name="fabric" defaultOption={null} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options").length).toBe(0);
  });
});
