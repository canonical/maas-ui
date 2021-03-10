import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LACPRateSelect from "./LACPRateSelect";

import { BondLacpRate } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  bondOptions as bondOptionsFactory,
  bondOptionsState as bondOptionsStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LACPRateSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        bondOptions: bondOptionsStateFactory({
          data: bondOptionsFactory({
            lacp_rates: [
              [BondLacpRate.FAST, BondLacpRate.FAST],
              [BondLacpRate.SLOW, BondLacpRate.SLOW],
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
          <LACPRateSelect name="lacp_rate" />
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
          <LACPRateSelect name="lacp_rate" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      { label: "Select LACP rate", value: "" },
      {
        label: BondLacpRate.FAST,
        value: BondLacpRate.FAST,
      },
      {
        label: BondLacpRate.SLOW,
        value: BondLacpRate.SLOW,
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
          <LACPRateSelect name="lacp_rate" defaultOption={defaultOption} />
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
          <LACPRateSelect name="lacp_rate" defaultOption={null} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options").length).toBe(0);
  });
});
