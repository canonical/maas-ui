import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import HashPolicySelect from "./HashPolicySelect";

import { BondXmitHashPolicy } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  bondOptions as bondOptionsFactory,
  bondOptionsState as bondOptionsStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("HashPolicySelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        bondOptions: bondOptionsStateFactory({
          data: bondOptionsFactory({
            xmit_hash_policies: [
              [BondXmitHashPolicy.LAYER2, BondXmitHashPolicy.LAYER2],
              [BondXmitHashPolicy.LAYER2_3, BondXmitHashPolicy.LAYER2_3],
              [BondXmitHashPolicy.LAYER3_4, BondXmitHashPolicy.LAYER3_4],
              [BondXmitHashPolicy.ENCAP2_3, BondXmitHashPolicy.ENCAP2_3],
              [BondXmitHashPolicy.ENCAP3_4, BondXmitHashPolicy.ENCAP3_4],
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
          <HashPolicySelect name="xmitHashPolicy" />
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
          <HashPolicySelect name="xmitHashPolicy" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      { label: "Select XMIT hash policy", value: "" },
      {
        label: BondXmitHashPolicy.LAYER2,
        value: BondXmitHashPolicy.LAYER2,
      },
      {
        label: BondXmitHashPolicy.LAYER2_3,
        value: BondXmitHashPolicy.LAYER2_3,
      },
      {
        label: BondXmitHashPolicy.LAYER3_4,
        value: BondXmitHashPolicy.LAYER3_4,
      },
      {
        label: BondXmitHashPolicy.ENCAP2_3,
        value: BondXmitHashPolicy.ENCAP2_3,
      },
      {
        label: BondXmitHashPolicy.ENCAP3_4,
        value: BondXmitHashPolicy.ENCAP3_4,
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
          <HashPolicySelect
            name="xmitHashPolicy"
            defaultOption={defaultOption}
          />
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
          <HashPolicySelect name="xmitHashPolicy" defaultOption={null} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options").length).toBe(0);
  });
});
