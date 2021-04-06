import { mount } from "enzyme";
import { Provider } from "react-redux";
import { Route, MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineTests from ".";

import { HardwareType } from "app/base/enum";
import type { RootState } from "app/store/root/types";
import {
  ScriptResultType,
  ScriptResultParamType,
} from "app/store/scriptresult/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineTests", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
      scriptresult: scriptResultStateFactory({
        loaded: true,
      }),
    });
  });

  it("renders headings for each hardware type", () => {
    state.nodescriptresult.items = { abc123: [1, 2, 3] };
    state.scriptresult.items = [
      scriptResultFactory({
        id: 1,
        result_type: ScriptResultType.TESTING,
        hardware_type: HardwareType.CPU,
      }),
      scriptResultFactory({
        id: 2,
        result_type: ScriptResultType.TESTING,
        hardware_type: HardwareType.Network,
      }),
      scriptResultFactory({
        id: 3,
        result_type: ScriptResultType.TESTING,
        hardware_type: HardwareType.Node,
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route path="/machine/:id">
            <MachineTests />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='hardware-heading']").at(0).text()).toEqual(
      "CPU"
    );
    expect(wrapper.find("[data-test='hardware-heading']").at(1).text()).toEqual(
      "Network"
    );
    expect(wrapper.find("[data-test='hardware-heading']").at(2).text()).toEqual(
      "Other Results"
    );
  });

  it("renders headings for each block device", () => {
    state.nodescriptresult.items = { abc123: [1, 2] };
    state.scriptresult.items = [
      scriptResultFactory({
        id: 2,
        result_type: ScriptResultType.TESTING,
        hardware_type: HardwareType.Storage,
        physical_blockdevice: 2,
        parameters: {
          storage: {
            type: ScriptResultParamType.STORAGE,
            value: {
              id: 44,
              model: "QEMU HARDDISK",
              name: "sda",
              serial: "lxd_root",
              id_path: "/dev/disk/by-id/scsi-0QEMU_QEMU_HARDDISK_lxd_root",
              physical_blockdevice_id: 2,
            },
          },
        },
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route path="/machine/:id">
            <MachineTests />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-test='storage-heading']").first().text()
    ).toEqual("/dev/sda (model: QEMU HARDDISK, serial: lxd_root)");
  });

  it("shows a heading for a block device without a model and serial", () => {
    state.nodescriptresult.items = { abc123: [1, 2] };
    state.scriptresult.items = [
      scriptResultFactory({
        id: 2,
        result_type: ScriptResultType.TESTING,
        hardware_type: HardwareType.Storage,
        physical_blockdevice: 2,
        parameters: {
          storage: {
            type: ScriptResultParamType.STORAGE,
            value: {
              id: 9,
              model: "",
              name: "sda",
              serial: "",
              id_path: "/dev/disk/by-id/scsi-0QEMU_QEMU_HARDDISK_lxd_root",
              physical_blockdevice_id: 2,
            },
          },
        },
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route path="/machine/:id">
            <MachineTests />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-test='storage-heading']").first().text()
    ).toEqual("/dev/sda");
  });

  it("shows a heading for a network interface", () => {
    state.nodescriptresult.items = { abc123: [1, 2] };
    state.scriptresult.items = [
      scriptResultFactory({
        id: 2,
        result_type: ScriptResultType.TESTING,
        hardware_type: HardwareType.Network,
        parameters: {
          interface: {
            type: ScriptResultParamType.INTERFACE,
            value: {
              id: 856,
              mac_address: "52:54:00:57:e9:ac",
              name: "ens4",
              product: null,
              vendor: "Red Hat, Inc.",
            },
          },
        },
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route path="/machine/:id">
            <MachineTests />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("[data-test='hardware-device-heading']").first().text()
    ).toEqual("ens4 (52:54:00:57:e9:ac)");
  });
});
