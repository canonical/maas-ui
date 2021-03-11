import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import BondModeSelect from "./BondModeSelect";

import { BondMode } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  bondOptions as bondOptionsFactory,
  bondOptionsState as bondOptionsStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("BondModeSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        bondOptions: bondOptionsStateFactory({
          data: bondOptionsFactory({
            modes: [
              [BondMode.BALANCE_RR, BondMode.BALANCE_RR],
              [BondMode.ACTIVE_BACKUP, BondMode.ACTIVE_BACKUP],
              [BondMode.BALANCE_XOR, BondMode.BALANCE_XOR],
              [BondMode.BROADCAST, BondMode.BROADCAST],
              [BondMode.LINK_AGGREGATION, BondMode.LINK_AGGREGATION],
              [BondMode.BALANCE_TLB, BondMode.BALANCE_TLB],
              [BondMode.BALANCE_ALB, BondMode.BALANCE_ALB],
            ],
          }),
          loaded: true,
        }),
      }),
    });
  });

  it("shows a spinner if the bond options haven't loaded", () => {
    state.general.bondOptions.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <BondModeSelect name="mode" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the options", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <BondModeSelect name="mode" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      { label: "Select bond mode", value: "" },
      {
        label: BondMode.BALANCE_RR,
        value: BondMode.BALANCE_RR,
      },
      {
        label: BondMode.ACTIVE_BACKUP,
        value: BondMode.ACTIVE_BACKUP,
      },
      {
        label: BondMode.BALANCE_XOR,
        value: BondMode.BALANCE_XOR,
      },
      {
        label: BondMode.BROADCAST,
        value: BondMode.BROADCAST,
      },
      {
        label: BondMode.LINK_AGGREGATION,
        value: BondMode.LINK_AGGREGATION,
      },
      {
        label: BondMode.BALANCE_TLB,
        value: BondMode.BALANCE_TLB,
      },
      {
        label: BondMode.BALANCE_ALB,
        value: BondMode.BALANCE_ALB,
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
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <BondModeSelect name="mode" defaultOption={defaultOption} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")[0]).toStrictEqual(
      defaultOption
    );
  });

  it("can hide the default option", () => {
    state.general.bondOptions.data = null;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <BondModeSelect name="mode" defaultOption={null} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options").length).toBe(0);
  });
});
