import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { LinkMonitoring } from "../types";

import BondFormFields from "./BondFormFields";

import {
  BondLacpRate,
  BondMode,
  BondXmitHashPolicy,
} from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  bondOptions as bondOptionsFactory,
  bondOptionsState as bondOptionsStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("BondFormFields", () => {
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
            modes: [
              [BondMode.BALANCE_RR, BondMode.BALANCE_RR],
              [BondMode.ACTIVE_BACKUP, BondMode.ACTIVE_BACKUP],
              [BondMode.BALANCE_XOR, BondMode.BALANCE_XOR],
              [BondMode.BROADCAST, BondMode.BROADCAST],
              [BondMode.LINK_AGGREGATION, BondMode.LINK_AGGREGATION],
              [BondMode.BALANCE_TLB, BondMode.BALANCE_TLB],
              [BondMode.BALANCE_ALB, BondMode.BALANCE_ALB],
            ],
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

  it("does not display the hash policy field by default", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <BondFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("HashPolicySelect").exists()).toBe(false);
  });

  it("displays the hash policy field for some bond modes", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <BondFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("select[name='bond_mode']").simulate("change", {
      target: {
        name: "bond_mode",
        value: BondMode.BALANCE_XOR,
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("HashPolicySelect").exists()).toBe(true);
  });

  it("does not display the lacp rate field by default", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <BondFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("LACPRateSelect").exists()).toBe(false);
  });

  it("displays the lacp rate field for some bond modes", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <BondFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("select[name='bond_mode']").simulate("change", {
      target: {
        name: "bond_mode",
        value: BondMode.LINK_AGGREGATION,
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("LACPRateSelect").exists()).toBe(true);
  });

  it("does not display the monitoring fields by default", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <BondFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField[name='bond_miimon']").exists()).toBe(
      false
    );
    expect(wrapper.find("FormikField[name='bond_updelay']").exists()).toBe(
      false
    );
    expect(wrapper.find("FormikField[name='bond_downdelay']").exists()).toBe(
      false
    );
  });

  it("displays the monitoring fields when link monitoring is set", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <BondFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("select[name='linkMonitoring']").simulate("change", {
      target: {
        name: "linkMonitoring",
        value: LinkMonitoring.MII,
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField[name='bond_miimon']").exists()).toBe(true);
    expect(wrapper.find("FormikField[name='bond_updelay']").exists()).toBe(
      true
    );
    expect(wrapper.find("FormikField[name='bond_downdelay']").exists()).toBe(
      true
    );
  });
});
