import type { ReactNode } from "react";

import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import {
  useCanAddVLAN,
  useCanEdit,
  useCanEditStorage,
  useFormattedOS,
  useHasInvalidArchitecture,
  useIsAllNetworkingDisabled,
  useIsLimitedEditingAllowed,
  useIsRackControllerConnected,
} from "./hooks";

import type { Machine } from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeStatus, NodeStatusCode } from "app/store/types/node";
import {
  architecturesState as architecturesStateFactory,
  fabric as fabricFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineEvent as machineEventFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
} from "testing/factories";

const mockStore = configureStore();

const generateWrapper = (store: MockStoreEnhanced<unknown>) => ({
  children,
}: {
  children: ReactNode;
}) => <Provider store={store}>{children}</Provider>;

describe("machine hook utils", () => {
  let state: RootState;
  let machine: Machine | null;

  beforeEach(() => {
    machine = machineFactory({
      architecture: "amd64",
      events: [machineEventFactory()],
      locked: false,
      permissions: ["edit"],
      system_id: "abc123",
    });
    state = rootStateFactory({
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          data: ["amd64"],
        }),
        osInfo: osInfoStateFactory({
          data: osInfoFactory(),
        }),
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        items: [machine],
      }),
    });
  });

  describe("useCanEdit", () => {
    it("handles an editable machine", () => {
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEdit(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });

    it("handles incorrect permissions", () => {
      state.machine.items[0].permissions = [];
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEdit(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("handles a locked machine", () => {
      state.machine.items[0].locked = true;
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEdit(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("handles a disconnected rack controller", () => {
      state.general.powerTypes.data = [];
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEdit(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("can ignore the rack controller state", () => {
      state.general.powerTypes.data = [];
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEdit(machine, true), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });
  });

  describe("useCanEditStorage", () => {
    it("handles a machine with editable storage", () => {
      const machine = machineFactory({
        locked: false,
        status_code: NodeStatusCode.READY,
        permissions: ["edit"],
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEditStorage(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });

    it("handles a machine without editable storage", () => {
      const machine = machineFactory({
        locked: false,
        status_code: NodeStatusCode.NEW,
        permissions: ["edit"],
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useCanEditStorage(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });
  });

  describe("useFormattedOS", () => {
    it("handles null case", () => {
      const store = mockStore(state);

      const { result } = renderHook(() => useFormattedOS(null), {
        wrapper: generateWrapper(store),
      });

      expect(result.current).toBe("");
    });

    it("handles Ubuntu releases", () => {
      state.machine.items[0].osystem = "ubuntu";
      state.machine.items[0].distro_series = "focal";
      state.general.osInfo.data = osInfoFactory({
        releases: [["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"']],
      });
      const store = mockStore(state);

      const { result } = renderHook(() => useFormattedOS(machine), {
        wrapper: generateWrapper(store),
      });

      expect(result.current).toBe("Ubuntu 20.04 LTS");
    });

    it("handles non-Ubuntu releases", () => {
      state.machine.items[0].osystem = "centos";
      state.machine.items[0].distro_series = "centos70";
      state.general.osInfo.data = osInfoFactory({
        releases: [["centos/centos70", "CentOS 7"]],
      });
      const store = mockStore(state);

      const { result } = renderHook(() => useFormattedOS(machine), {
        wrapper: generateWrapper(store),
      });

      expect(result.current).toBe("CentOS 7");
    });
  });

  describe("useHasInvalidArchitecture", () => {
    it("can return a valid result", () => {
      const store = mockStore(state);
      const { result } = renderHook(() => useHasInvalidArchitecture(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("handles a machine that has no architecture", () => {
      state.machine.items[0].architecture = "";
      const store = mockStore(state);
      const { result } = renderHook(() => useHasInvalidArchitecture(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });

    it("handles an architecture with no match", () => {
      state.machine.items[0].architecture = "unknown";
      const store = mockStore(state);
      const { result } = renderHook(() => useHasInvalidArchitecture(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });
  });

  describe("useIsAllNetworkingDisabled", () => {
    it("is disabled when machine is not editable", () => {
      machine = machineFactory({
        permissions: [],
        system_id: "abc123",
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useIsAllNetworkingDisabled(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });

    it("is disabled when there is no machine", () => {
      const store = mockStore(state);
      const { result } = renderHook(() => useIsAllNetworkingDisabled(null), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });

    it("is disabled when the machine has the wrong status", () => {
      machine = machineFactory({
        status: NodeStatus.DEPLOYING,
        system_id: "abc123",
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useIsAllNetworkingDisabled(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });

    it("can be not disabled", () => {
      const store = mockStore(state);
      const { result } = renderHook(() => useIsAllNetworkingDisabled(machine), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });
  });

  describe("useIsRackControllerConnected", () => {
    it("handles a connected state", () => {
      state.general.powerTypes = powerTypesStateFactory({
        data: [powerTypeFactory()],
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useIsRackControllerConnected(), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(true);
    });

    it("handles a disconnected state", () => {
      state.general.powerTypes.data = [];
      const store = mockStore(state);
      const { result } = renderHook(() => useIsRackControllerConnected(), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });
  });

  describe("useIsLimitedEditingAllowed", () => {
    it("allows limited editing", () => {
      machine = machineFactory({
        locked: false,
        permissions: ["edit"],
        status: NodeStatus.DEPLOYED,
        system_id: "abc123",
      });
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const store = mockStore(state);
      const { result } = renderHook(
        () => useIsLimitedEditingAllowed(nic, machine),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current).toBe(true);
    });

    it("does not allow limited editing when the machine is not editable", () => {
      machine = machineFactory({
        locked: false,
        permissions: [],
        status: NodeStatus.DEPLOYED,
        system_id: "abc123",
      });
      const nic = machineInterfaceFactory();
      const store = mockStore(state);
      const { result } = renderHook(
        () => useIsLimitedEditingAllowed(nic, machine),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current).toBe(false);
    });

    it("does not allow limited editing when the machine is not deployed", () => {
      machine = machineFactory({
        permissions: ["edit"],
        status: NodeStatus.NEW,
        system_id: "abc123",
      });
      const nic = machineInterfaceFactory();
      const store = mockStore(state);
      const { result } = renderHook(
        () => useIsLimitedEditingAllowed(nic, machine),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current).toBe(false);
    });

    it("does not allow limited editing when the nic is a VLAN", () => {
      const nic = machineInterfaceFactory({ type: NetworkInterfaceTypes.VLAN });
      const store = mockStore(state);
      const { result } = renderHook(
        () => useIsLimitedEditingAllowed(nic, machine),
        {
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current).toBe(false);
    });
  });

  describe("useCanAddVLAN", () => {
    it("can not add a VLAN if the nic is an alias", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.ALIAS,
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useCanAddVLAN(machine, nic), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("can not add a VLAN if the nic is a VLAN", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.VLAN,
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useCanAddVLAN(machine, nic), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("can not add a VLAN if there are no unused VLANS", () => {
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useCanAddVLAN(machine, nic), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });

    it("can add a VLAN if there are unused VLANS", () => {
      const fabric = fabricFactory();
      state.fabric.items = [fabric];
      const vlan = vlanFactory({ fabric: fabric.id });
      state.vlan.items = [vlan];
      const nic = machineInterfaceFactory({
        type: NetworkInterfaceTypes.PHYSICAL,
        vlan_id: vlan.id,
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useCanAddVLAN(machine, nic), {
        wrapper: generateWrapper(store),
      });
      expect(result.current).toBe(false);
    });
  });
});
