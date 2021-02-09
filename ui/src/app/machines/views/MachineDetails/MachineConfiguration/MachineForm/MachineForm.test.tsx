import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import MachineForm from "./MachineForm";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineForm", () => {
  it("is not editable if machine does not have edit permission", () => {
    const machine = machineDetailsFactory({
      permissions: [],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MachineForm systemId="abc123" />
      </Provider>
    );

    expect(
      wrapper.find("button[data-test='edit-machine-config']").exists()
    ).toBe(false);
  });

  it("is disabled until the edit button is pressed", () => {
    const machine = machineDetailsFactory({
      permissions: ["edit"],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MachineForm systemId="abc123" />
      </Provider>
    );

    expect(wrapper.find("FormikForm").prop("editable")).toBe(false);

    wrapper.find("button[data-test='edit-machine-config']").simulate("click");

    expect(wrapper.find("FormikForm").prop("editable")).toBe(true);
  });

  it("correctly dispatches an action to update a machine", () => {
    const machine = machineDetailsFactory({
      permissions: ["edit"],
      system_id: "abc123",
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MachineForm systemId="abc123" />
      </Provider>
    );

    wrapper.find("Formik").prop("onSubmit")({
      architecture: "amd64/generic",
      description: "It's on",
      minHweKernel: "groovy (ga-20.10)",
      pool: "swimming",
      tags: ["tag1", "tag2"],
      zone: "twilight",
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
          architecture: "amd64/generic",
          description: "It's on",
          extra_macs: machine.extra_macs,
          min_hwe_kernel: "groovy (ga-20.10)",
          pool: { name: "swimming" },
          pxe_mac: machine.pxe_mac,
          system_id: machine.system_id,
          tags: ["tag1", "tag2"],
          zone: { name: "twilight" },
        },
      },
      type: "machine/update",
    });
  });
});
