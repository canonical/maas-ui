import configureStore from "redux-mock-store";

import DiscoveryDeleteForm from "./DiscoveryDeleteForm";

import { actions as discoveryActions } from "@/app/store/discovery";
import type { Discovery } from "@/app/store/discovery/types";
import type { RootState } from "@/app/store/root/types";
import {
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
} from "@/app/store/types/node";
import { callId, enableCallIdMocks } from "@/testing/callId-mock";
import {
  discovery as discoveryFactory,
  domain as domainFactory,
  device as deviceFactory,
  machine as machineFactory,
  testStatus as testStatusFactory,
  modelRef as modelRefFactory,
  discoveryState as discoveryStateFactory,
  deviceState as deviceStateFactory,
  domainState as domainStateFactory,
  machineState as machineStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  rootState as rootStateFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState, {}>();
enableCallIdMocks();

let state: RootState;
let discovery: Discovery;

beforeEach(() => {
  const machines = [
    machineFactory({
      actions: [],
      architecture: "amd64/generic",
      cpu_count: 4,
      cpu_test_status: testStatusFactory({
        status: TestStatusStatus.RUNNING,
      }),
      distro_series: "bionic",
      domain: modelRefFactory({
        name: "example",
      }),
      extra_macs: [],
      fqdn: "koala.example",
      hostname: "koala",
      ip_addresses: [],
      memory: 8,
      memory_test_status: testStatusFactory({
        status: TestStatusStatus.PASSED,
      }),
      network_test_status: testStatusFactory({
        status: TestStatusStatus.PASSED,
      }),
      osystem: "ubuntu",
      owner: "admin",
      permissions: ["edit", "delete"],
      physical_disk_count: 1,
      pool: modelRefFactory(),
      pxe_mac: "00:11:22:33:44:55",
      spaces: [],
      status: NodeStatus.DEPLOYED,
      status_code: NodeStatusCode.DEPLOYED,
      status_message: "",
      storage: 8,
      storage_test_status: testStatusFactory({
        status: TestStatusStatus.PASSED,
      }),
      testing_status: TestStatusStatus.PASSED,
      system_id: "abc123",
      zone: modelRefFactory(),
    }),
  ];
  discovery = discoveryFactory({
    ip: "1.2.3.4",
    mac_address: "aa:bb:cc",
    subnet: 9,
    vlan: 8,
  });
  state = rootStateFactory({
    device: deviceStateFactory({
      loaded: true,
      items: [deviceFactory({ system_id: "abc123", fqdn: "abc123.example" })],
    }),
    discovery: discoveryStateFactory({
      loaded: true,
      items: [discovery],
    }),
    domain: domainStateFactory({
      loaded: true,
      items: [domainFactory({ name: "local" })],
    }),
    machine: machineStateFactory({
      loaded: true,
      items: machines,
      lists: {
        [callId]: machineStateListFactory({
          loaded: true,
          groups: [
            machineStateListGroupFactory({
              items: [machines[0].system_id],
              name: "Deployed",
            }),
          ],
        }),
      },
    }),
    subnet: subnetStateFactory({ loaded: true }),
    vlan: vlanStateFactory({ loaded: true }),
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

it("renders", () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <DiscoveryDeleteForm discovery={discovery} onClose={vi.fn()} />,
    { store }
  );
});

it("can dispatch an action to delete a discovery", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <DiscoveryDeleteForm discovery={discovery} onClose={vi.fn()} />,
    { store }
  );

  await userEvent.click(screen.getByRole("button", { name: /delete/i }));

  expect(
    store.getActions().find((action) => action.type === "discovery/delete")
  ).toStrictEqual(
    discoveryActions.delete({ ip: discovery.ip, mac: discovery.mac_address })
  );
});
