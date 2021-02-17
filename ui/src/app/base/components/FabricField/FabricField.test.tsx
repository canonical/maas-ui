import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import FabricField from "./FabricField";

import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("FabricField", () => {
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
          <FabricField />
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
          <FabricField />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      {
        label: items[0].name,
        value: items[0].id,
      },
      {
        label: items[1].name,
        value: items[1].id,
      },
    ]);
  });
});
