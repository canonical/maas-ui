import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
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

  it("only shows errors if the form is in editing state", () => {
    state.machine.items[0].permissions = ["edit"];
    state.machine.errors = "Everything is ruined";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerForm systemId="abc123" />
      </Provider>
    );
    const notificationExists = () =>
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("Everything is ruined")
        )
        .exists();
    expect(notificationExists()).toBe(false);

    // Click "Edit" button
    wrapper.find("button[data-test='edit-power-config']").simulate("click");
    expect(notificationExists()).toBe(true);
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

  it("resets the form fields when editing is cancelled", async () => {
    state.general.powerTypes.data = [
      powerTypeFactory({
        fields: [powerFieldFactory({ name: "field1" })],
        name: "power-type-1",
      }),
      powerTypeFactory({
        fields: [powerFieldFactory({ default: "value2", name: "field2" })],
        name: "power-type-2",
      }),
    ];
    state.machine.items = [
      machineDetailsFactory({
        pod: undefined, // Unset pod so power type select is enabled
        power_parameters: {
          field1: "value1",
        },
        power_type: "power-type-1",
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerForm systemId="abc123" />
      </Provider>
    );

    // Check that the power type and field are initialised correctly.
    expect(wrapper.find("select[name='powerType']").prop("value")).toBe(
      "power-type-1"
    );
    expect(
      wrapper.find("input[name='powerParameters.field1']").prop("value")
    ).toBe("value1");
    expect(wrapper.find("input[name='powerParameters.field2']").exists()).toBe(
      false
    );

    // Get into editing state and change the power type
    await act(async () => {
      wrapper.find("button[data-test='edit-power-config']").simulate("click");
      wrapper.find("select[name='powerType']").simulate("change", {
        target: { name: "powerType", value: "power-type-2" },
      });
    });
    wrapper.update();

    // Check that power type and field have changed.
    expect(wrapper.find("select[name='powerType']").prop("value")).toBe(
      "power-type-2"
    );
    expect(wrapper.find("input[name='powerParameters.field1']").exists()).toBe(
      false
    );
    expect(
      wrapper.find("input[name='powerParameters.field2']").prop("value")
    ).toBe("value2");

    // Click the "Cancel" button
    await act(async () => {
      wrapper.find("button[data-test='cancel-action']").simulate("click");
    });
    wrapper.update();

    // Check that the power type and field are reverted to initial values.
    expect(wrapper.find("select[name='powerType']").prop("value")).toBe(
      "power-type-1"
    );
    expect(
      wrapper.find("input[name='powerParameters.field1']").prop("value")
    ).toBe("value1");
    expect(wrapper.find("input[name='powerParameters.field2']").exists()).toBe(
      false
    );
  });

  it("dispatches cleanup action on cancel", () => {
    state.machine.items[0].permissions = ["edit"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <PowerForm systemId="abc123" />
      </Provider>
    );

    // Get into editing state and then cancel editing.
    act(() => {
      wrapper.find("button[data-test='edit-power-config']").simulate("click");
    });
    wrapper.update();
    act(() => {
      wrapper.find("button[data-test='cancel-action']").simulate("click");
    });
    wrapper.update();

    // Check that the cleanup action was dispatched.
    expect(
      store.getActions().some((action) => action.type === "machine/cleanup")
    );
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
