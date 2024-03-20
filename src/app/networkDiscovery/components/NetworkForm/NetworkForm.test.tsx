import configureStore from "redux-mock-store";

import type { NetworkDiscoverySidePanelContent } from "../../views/constants";
import { NetworkDiscoverySidePanelViews } from "../../views/constants";

import NetworkForm from "./NetworkForm";

import type { Discovery } from "@/app/store/discovery/types";
import type { RootState } from "@/app/store/root/types";
import {
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
} from "@/app/store/types/node";
import { callId, enableCallIdMocks } from "@/testing/callId-mock";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

const mockStore = configureStore<RootState, {}>();
enableCallIdMocks();

let state: RootState;
let discovery: Discovery;

beforeEach(() => {
  const machines = [
    factory.machine({
      actions: [],
      architecture: "amd64/generic",
      cpu_count: 4,
      cpu_test_status: factory.testStatus({
        status: TestStatusStatus.RUNNING,
      }),
      distro_series: "bionic",
      domain: factory.modelRef({
        name: "example",
      }),
      extra_macs: [],
      fqdn: "koala.example",
      hostname: "koala",
      ip_addresses: [],
      memory: 8,
      memory_test_status: factory.testStatus({
        status: TestStatusStatus.PASSED,
      }),
      network_test_status: factory.testStatus({
        status: TestStatusStatus.PASSED,
      }),
      osystem: "ubuntu",
      owner: "admin",
      permissions: ["edit", "delete"],
      physical_disk_count: 1,
      pool: factory.modelRef(),
      pxe_mac: "00:11:22:33:44:55",
      spaces: [],
      status: NodeStatus.DEPLOYED,
      status_code: NodeStatusCode.DEPLOYED,
      status_message: "",
      storage: 8,
      storage_test_status: factory.testStatus({
        status: TestStatusStatus.PASSED,
      }),
      testing_status: TestStatusStatus.PASSED,
      system_id: "abc123",
      zone: factory.modelRef(),
    }),
  ];
  discovery = factory.discovery({
    ip: "1.2.3.4",
    mac_address: "aa:bb:cc",
    subnet: 9,
    vlan: 8,
  });
  state = factory.rootState({
    device: factory.deviceState({
      loaded: true,
      items: [factory.device({ system_id: "abc123", fqdn: "abc123.example" })],
    }),
    discovery: factory.discoveryState({
      loaded: true,
      items: [discovery],
    }),
    domain: factory.domainState({
      loaded: true,
      items: [factory.domain({ name: "local" })],
    }),
    machine: factory.machineState({
      loaded: true,
      items: machines,
      lists: {
        [callId]: factory.machineStateList({
          loaded: true,
          groups: [
            factory.machineStateListGroup({
              items: [machines[0].system_id],
              name: "Deployed",
            }),
          ],
        }),
      },
    }),
    subnet: factory.subnetState({ loaded: true }),
    vlan: factory.vlanState({ loaded: true }),
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

it("renders the clear discovery form when the sidepanel view is provided", () => {
  const sidePanelContent: NetworkDiscoverySidePanelContent = {
    view: NetworkDiscoverySidePanelViews.CLEAR_ALL_DISCOVERIES,
  };
  renderWithBrowserRouter(
    <NetworkForm
      setSidePanelContent={vi.fn()}
      sidePanelContent={sidePanelContent}
    />
  );

  expect(
    screen.getByRole("form", { name: "Clear all discoveries" })
  ).toBeInTheDocument();
});

it("renders the add discovery form given the sidepanel view", () => {
  const store = mockStore(state);
  const sidePanelContent: NetworkDiscoverySidePanelContent = {
    view: NetworkDiscoverySidePanelViews.ADD_DISCOVERY,
    extras: {
      discovery,
    },
  };

  renderWithBrowserRouter(
    <NetworkForm
      setSidePanelContent={vi.fn()}
      sidePanelContent={sidePanelContent}
    />,
    { store }
  );

  expect(
    screen.getByRole("form", { name: "Add discovery" })
  ).toBeInTheDocument();
});
