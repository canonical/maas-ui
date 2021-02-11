import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import PowerForm from "./PowerForm";

import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("PowerForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory({ fields: [], name: "manual" })],
          loaded: true,
        }),
      }),
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
  });

  it("is not editable if machine does not have edit permission", () => {
    state.machine.items[0].permissions = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerForm systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("button[data-test='edit-power-config']").exists()).toBe(
      false
    );
  });

  it("is disabled until the edit button is pressed", () => {
    state.machine.items[0].permissions = ["edit"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerForm systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("FormikForm").prop("editable")).toBe(false);

    wrapper.find("button[data-test='edit-power-config']").simulate("click");

    expect(wrapper.find("FormikForm").prop("editable")).toBe(true);
  });

  it("initialises the form with machine power parameters", () => {
    state.general.powerTypes.data = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({ name: "field1" }),
          powerFieldFactory({ name: "field2" }),
        ],
        name: "power-type",
      }),
    ];
    state.machine.items = [
      machineDetailsFactory({
        power_parameters: {
          field1: "value1",
          field2: "value2",
        },
        power_type: "power-type",
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerForm systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("Formik").prop("initialValues")).toStrictEqual({
      powerType: "power-type",
      powerParameters: { field1: "value1", field2: "value2" },
    });
  });

  it("correctly dispatches an action to update a machine's power", () => {
    const machine = machineDetailsFactory({
      permissions: ["edit"],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerForm systemId="abc123" />
      </Provider>
    );

    wrapper.find("Formik").prop("onSubmit")({
      powerParameters: {},
      powerType: "manual",
    });

    expect(
      store.getActions().find((action) => action.type === "machine/update")
    ).toStrictEqual({
      meta: {
        method: "update",
        model: "machine",
      },
      payload: {
        params: {
          extra_macs: machine.extra_macs,
          power_parameters: {},
          power_type: "manual",
          pxe_mac: machine.pxe_mac,
          system_id: machine.system_id,
        },
      },
      type: "machine/update",
    });
  });
});
