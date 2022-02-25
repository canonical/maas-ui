import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ZoneSelect from "./ZoneSelect";

import { ACTION_STATUS } from "app/base/constants";
import { ZONE_ACTIONS } from "app/store/zone/constants";
import {
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ZoneSelect", () => {
  it("renders a list of all zones in state", () => {
    const state = rootStateFactory({
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.successful,
        }),
        items: [
          zoneFactory({ id: 101, name: "Pool 1" }),
          zoneFactory({ id: 202, name: "Pool 2" }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ zone: "" }} onSubmit={jest.fn()}>
          <ZoneSelect name="zone" />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("select[name='zone']")).toMatchSnapshot();
  });

  it("dispatches action to fetch zones on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <Formik initialValues={{ zone: "" }} onSubmit={jest.fn()}>
          <ZoneSelect name="zone" />
        </Formik>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "zone/fetch")
    ).toBe(true);
  });

  it("disables select if zones have not loaded", () => {
    const state = rootStateFactory({
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({
          [ZONE_ACTIONS.fetch]: ACTION_STATUS.idle,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ zone: "" }} onSubmit={jest.fn()}>
          <ZoneSelect name="zone" />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("select[name='zone']").prop("disabled")).toBe(true);
  });
});
