import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AddAliasOrVlan, {
  Labels as AddAliasOrVlanLabels,
} from "./AddAliasOrVlan";

import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "app/store/types/enum";
import {
  NodeStatus,
  NodeStatusCode,
  TestStatusStatus,
} from "app/store/types/node";
import type { NetworkInterface } from "app/store/types/node";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  modelRef as modelRefFactory,
  rootState as rootStateFactory,
  testStatus as testStatusFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, submitFormikForm } from "testing/utils";

const mockStore = configureStore<RootState, {}>();
const route = "/machines";

describe("AddAliasOrVlan", () => {
  let state: RootState;
  let nic: NetworkInterface;
  beforeEach(() => {
    nic = machineInterfaceFactory();
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
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
            interfaces: [nic],
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
            testing_status: testStatusFactory({
              status: TestStatusStatus.PASSED,
            }),
            system_id: "abc123",
            zone: modelRefFactory(),
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
  });

  it("displays a spinner when data is loading", () => {
    state.machine.items = [];
    renderWithBrowserRouter(
      <AddAliasOrVlan
        close={jest.fn()}
        interfaceType={NetworkInterfaceTypes.VLAN}
        systemId="abc123"
      />,
      { route, wrapperProps: { state } }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // it("displays a save-another button for aliases", () => {
  //   renderWithBrowserRouter(
  //     <AddAliasOrVlan
  //       close={jest.fn()}
  //       interfaceType={NetworkInterfaceTypes.ALIAS}
  //       nic={nic}
  //       systemId="abc123"
  //     />,
  //     { route: route, wrapperProps: { state } }
  //   );
  //   const secondarySubmit = screen.getByRole("button", {
  //     name: AddAliasOrVlanLabels.SecondarySubmitLabel,
  //   });
  //   // expect(secondarySubmit).not.toBeDisabled();
  //   screen.debug(undefined, 30000);
  // });

  // it("displays a save-another button when there are unused VLANS", () => {
  //   const fabric = fabricFactory();
  //   state.fabric.items = [fabric];
  //   const vlan = vlanFactory({ fabric: fabric.id });
  //   state.vlan.items = [vlan, vlanFactory({ fabric: fabric.id })];
  //   const nic = machineInterfaceFactory({
  //     type: NetworkInterfaceTypes.PHYSICAL,
  //     vlan_id: vlan.id,
  //   });
  //   state.machine.items = [
  //     machineDetailsFactory({
  //       interfaces: [nic],
  //       system_id: "abc123",
  //     }),
  //   ];
  //   // const store = mockStore(state);
  //   renderWithBrowserRouter(
  //     <AddAliasOrVlan
  //       close={jest.fn()}
  //       interfaceType={NetworkInterfaceTypes.VLAN}
  //       nic={nic}
  //       systemId="abc123"
  //     />,
  //     { route, wrapperProps: { state } }
  //   );
  //   expect(
  //     screen.getByRole("button", {
  //       name: AddAliasOrVlanLabels.SecondarySubmitLabel,
  //     })
  //   ).toBeInTheDocument();
  // });

  // it("disables the save-another button when there are no unused VLANS", () => {
  //   state.vlan.items = [];
  //   renderWithBrowserRouter(
  //     <AddAliasOrVlan
  //       close={jest.fn()}
  //       interfaceType={NetworkInterfaceTypes.VLAN}
  //       nic={nic}
  //       systemId="abc123"
  //     />,
  //     { route, wrapperProps: { state } }
  //   );
  //   // expect(wrapper.find("FormikForm").prop("secondarySubmitDisabled")).toBe(
  //   //   true
  //   // );
  //   // expect(wrapper.find("FormikForm").prop("secondarySubmitTooltip")).toBe(
  //   //   "There are no more unused VLANS for this interface."
  //   // );
  //   screen.debug();
  // });

  // it("correctly initialises fabric and VLAN when adding an alias", () => {
  //   const fabric = fabricFactory({ id: 1 });
  //   const vlan = vlanFactory({ fabric: fabric.id, id: 5001 });
  //   const nic = machineInterfaceFactory({ vlan_id: vlan.id });
  //   const machine = machineDetailsFactory({
  //     system_id: "abc123",
  //     interfaces: [nic],
  //   });
  //   const state = rootStateFactory({
  //     fabric: fabricStateFactory({
  //       items: [fabric],
  //       loaded: true,
  //       loading: false,
  //     }),
  //     machine: machineStateFactory({
  //       items: [machine],
  //       statuses: machineStatusesFactory({
  //         [machine.system_id]: machineStatusFactory(),
  //       }),
  //     }),
  //     vlan: vlanStateFactory({
  //       items: [vlan],
  //       loaded: true,
  //       loading: false,
  //     }),
  //   });
  //   const store = mockStore(state);
  //   const wrapper = mount(
  //     <Provider store={store}>
  //       <MemoryRouter
  //         initialEntries={[{ pathname: "/machines", key: "testKey" }]}
  //       >
  //         <CompatRouter>
  //           <AddAliasOrVlan
  //             close={jest.fn()}
  //             interfaceType={NetworkInterfaceTypes.ALIAS}
  //             nic={nic}
  //             systemId="abc123"
  //           />
  //         </CompatRouter>
  //       </MemoryRouter>
  //     </Provider>
  //   );

  //   expect(
  //     wrapper
  //       .findWhere(
  //         (node) =>
  //           node.name() === "select" &&
  //           node.prop("name") === "fabric" &&
  //           node.prop("value") === fabric.id
  //       )
  //       .exists()
  //   ).toBe(true);
  //   expect(
  //     wrapper
  //       .findWhere(
  //         (node) =>
  //           node.name() === "select" &&
  //           node.prop("name") === "vlan" &&
  //           node.prop("value") === vlan.id
  //       )
  //       .exists()
  //   ).toBe(true);
  // });

  // it("correctly dispatches actions to add a VLAN", () => {
  //   const nic = machineInterfaceFactory();
  //   const store = mockStore(state);
  //   const wrapper = mount(
  //     <Provider store={store}>
  //       <MemoryRouter
  //         initialEntries={[{ pathname: "/machines", key: "testKey" }]}
  //       >
  //         <CompatRouter>
  //           <AddAliasOrVlan
  //             close={jest.fn()}
  //             interfaceType={NetworkInterfaceTypes.VLAN}
  //             nic={nic}
  //             systemId="abc123"
  //           />
  //         </CompatRouter>
  //       </MemoryRouter>
  //     </Provider>
  //   );

  //   act(() =>
  //     submitFormikForm(wrapper, {
  //       ip_address: "1.2.3.4",
  //       mode: NetworkLinkMode.AUTO,
  //       tags: ["koala", "tag"],
  //       vlan: 9,
  //     })
  //   );
  //   expect(
  //     store.getActions().find((action) => action.type === "machine/createVlan")
  //   ).toStrictEqual({
  //     type: "machine/createVlan",
  //     meta: {
  //       model: "machine",
  //       method: "create_vlan",
  //     },
  //     payload: {
  //       params: {
  //         ip_address: "1.2.3.4",
  //         mode: NetworkLinkMode.AUTO,
  //         parent: nic.id,
  //         system_id: "abc123",
  //         tags: ["koala", "tag"],
  //         vlan: 9,
  //       },
  //     },
  //   });
  // });

  // it("correctly dispatches actions to add an alias", () => {
  //   const store = mockStore(state);
  //   const wrapper = mount(
  //     <Provider store={store}>
  //       <MemoryRouter
  //         initialEntries={[{ pathname: "/machines", key: "testKey" }]}
  //       >
  //         <CompatRouter>
  //           <AddAliasOrVlan
  //             close={jest.fn()}
  //             interfaceType={NetworkInterfaceTypes.ALIAS}
  //             nic={nic}
  //             systemId="abc123"
  //           />
  //         </CompatRouter>
  //       </MemoryRouter>
  //     </Provider>
  //   );

  //   act(() =>
  //     submitFormikForm(wrapper, {
  //       ip_address: "1.2.3.4",
  //       mode: NetworkLinkMode.AUTO,
  //       subnet: 3,
  //       system_id: "abc123",
  //     })
  //   );
  //   expect(
  //     store.getActions().find((action) => action.type === "machine/linkSubnet")
  //   ).toStrictEqual({
  //     type: "machine/linkSubnet",
  //     meta: {
  //       model: "machine",
  //       method: "link_subnet",
  //     },
  //     payload: {
  //       params: {
  //         interface_id: nic.id,
  //         ip_address: "1.2.3.4",
  //         mode: NetworkLinkMode.AUTO,
  //         subnet: 3,
  //         system_id: "abc123",
  //       },
  //     },
  //   });
  // });
});
