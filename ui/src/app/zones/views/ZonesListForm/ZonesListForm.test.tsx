import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ZonesListHeader from "../ZonesListHeader/ZonesListHeader";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();
let state: RootState;

describe("ZonesListForm", () => {
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("displays the form when Add AZ is clicked", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ZonesListHeader />
      </Provider>
    );
    expect(wrapper.find("ZonesListForm").exists()).toBe(false);

    wrapper.find("button[data-test='add-zone']").simulate("click");

    expect(wrapper.find("ZonesListForm").exists()).toBe(true);
  });

  it("calls actions.create on save click", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ZonesListHeader />
      </Provider>
    );
    wrapper.find("button[data-test='add-zone']").simulate("click");

    act(() =>
      wrapper.find("Formik").invoke("onSubmit")({
        name: "test-zone",
      })
    );

    expect(
      store.getActions().find((action) => action.type === "zone/create")
    ).toStrictEqual({
      type: "zone/create",
      meta: {
        method: "create",
        model: "zone",
      },
      payload: {
        params: {
          name: "test-zone",
        },
      },
    });
  });
});
