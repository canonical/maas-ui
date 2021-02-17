import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import PowerFormFields from ".";

import { PowerFieldScope } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("PowerFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory({ fields: [], name: "manual" })],
          loaded: true,
        }),
      }),
    });
  });

  it("shows an error if no rack controller is connected", () => {
    state.general.powerTypes.data = [];
    const machine = machineDetailsFactory({ system_id: "abc123" });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            powerParameters: {},
            powerType: "power-type",
          }}
          onSubmit={jest.fn()}
        >
          <PowerFormFields editing={false} machine={machine} />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("[data-test='no-rack-controller']").exists()).toBe(
      true
    );
  });

  it("shows an error if a power type has not been set", () => {
    const machine = machineDetailsFactory({ system_id: "abc123" });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            powerParameters: {},
            powerType: "",
          }}
          onSubmit={jest.fn()}
        >
          <PowerFormFields editing={false} machine={machine} />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("[data-test='no-power-type']").exists()).toBe(true);
  });

  it("shows a warning if the power type is set to manual", () => {
    const machine = machineDetailsFactory({ system_id: "abc123" });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            powerParameters: {},
            powerType: "manual",
          }}
          onSubmit={jest.fn()}
        >
          <PowerFormFields editing={false} machine={machine} />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("[data-test='manual-power-type']").exists()).toBe(true);
  });

  it("shows an error if editing and the selected power type is missing packages", () => {
    state.general.powerTypes.data = [
      powerTypeFactory({
        description: "the Infinity gauntlet",
        missing_packages: ["green-infinity-stone", "red-infinity-stone"],
        name: "ultimate-power",
      }),
    ];
    const machine = machineDetailsFactory({ system_id: "abc123" });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            powerParameters: {},
            powerType: "ultimate-power",
          }}
          onSubmit={jest.fn()}
        >
          <PowerFormFields editing machine={machine} />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("[data-test='missing-packages']").exists()).toBe(true);
    expect(
      wrapper
        .find("[data-test='missing-packages'] .p-notification__response")
        .text()
    ).toBe(
      "Power control software for the Infinity gauntlet is missing from the rack controller. To proceed, install the following packages on the rack controller: green-infinity-stone, red-infinity-stone"
    );
  });

  it("disables the power select and limits field scopes to node if machine is in a pod", () => {
    state.general.powerTypes.data = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({
            name: "node-field",
            scope: PowerFieldScope.NODE,
          }),
          powerFieldFactory({
            name: "bmc-field",
            scope: PowerFieldScope.BMC,
          }),
        ],
        name: "power-type",
      }),
    ];
    const machine = machineDetailsFactory({
      pod: {
        id: 1,
        name: "pod",
      },
      power_bmc_node_count: 1,
      power_type: "power-type",
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            powerParameters: {},
            powerType: "power-type",
          }}
          onSubmit={jest.fn()}
        >
          <PowerFormFields editing machine={machine} />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("Select[name='powerType']").prop("disabled")).toBe(
      true
    );
    expect(
      wrapper.find("input[name='powerParameters.node-field']").exists()
    ).toBe(true);
    expect(
      wrapper.find("input[name='powerParameters.bmc-field']").exists()
    ).toBe(false);
  });
});
