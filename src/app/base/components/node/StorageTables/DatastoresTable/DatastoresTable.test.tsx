import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DatastoresTable from "./DatastoresTable";

import { actions as machineActions } from "@/app/store/machine";
import * as factory from "@/testing/factories";
import { userEvent, render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("shows a message if no datastores are detected", () => {
  const notDatastore = factory.nodeFilesystem({ fstype: "fat32" });
  const machine = factory.machineDetails({
    disks: [
      factory.nodeDisk({ name: "not-datastore", filesystem: notDatastore }),
    ],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <DatastoresTable canEditStorage node={machine} />
    </Provider>
  );
  expect(screen.getByTestId("no-datastores")).toHaveTextContent(
    "No datastores detected."
  );
});

it("only shows filesystems that are VMFS6 datastores", () => {
  const [datastore, notDatastore] = [
    factory.nodeFilesystem({ fstype: "vmfs6" }),
    factory.nodeFilesystem({ fstype: "fat32" }),
  ];
  const [dsDisk, notDsDisk] = [
    factory.nodeDisk({ name: "datastore", filesystem: datastore }),
    factory.nodeDisk({ name: "not-datastore", filesystem: notDatastore }),
  ];
  const machine = factory.machineDetails({
    disks: [dsDisk, notDsDisk],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <DatastoresTable canEditStorage node={machine} />
    </Provider>
  );

  expect(screen.getAllByRole("gridcell", { name: "Name" })).toHaveLength(1);
  expect(screen.getByRole("gridcell", { name: "Name" })).toHaveTextContent(
    dsDisk.name
  );
});

it("does not show an action column if node is a controller", () => {
  const controller = factory.controllerDetails({
    disks: [
      factory.nodeDisk({
        name: "datastore",
        filesystem: factory.nodeFilesystem({ fstype: "vmfs6" }),
      }),
    ],
    system_id: "abc123",
  });
  const state = factory.rootState({
    controller: factory.controllerState({
      items: [controller],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <DatastoresTable canEditStorage node={controller} />
    </Provider>
  );

  expect(
    screen.queryByRole("columnheader", { name: "Actions" })
  ).not.toBeInTheDocument();
});

it("shows an action column if node is a machine", () => {
  const machine = factory.machineDetails({
    disks: [
      factory.nodeDisk({
        name: "datastore",
        filesystem: factory.nodeFilesystem({ fstype: "vmfs6" }),
      }),
    ],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <DatastoresTable canEditStorage node={machine} />
    </Provider>
  );

  expect(
    screen.getByRole("columnheader", { name: "Actions" })
  ).toBeInTheDocument();
});

it("can remove a datastore if node is a machine", async () => {
  const datastore = factory.nodeFilesystem({ fstype: "vmfs6" });
  const disk = factory.nodeDisk({ filesystem: datastore });
  const machine = factory.machineDetails({
    disks: [disk],
    system_id: "abc123",
  });
  const state = factory.rootState({
    machine: factory.machineState({
      items: [machine],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <DatastoresTable canEditStorage node={machine} />
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
  await userEvent.click(
    screen.getByRole("button", { name: "Remove datastore..." })
  );
  expect(
    screen.getByText(
      "Are you sure you want to remove this datastore? ESXi requires at least one VMFS datastore to deploy."
    )
  ).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "Remove datastore" })
  );

  const expectedAction = machineActions.deleteDisk({
    blockId: disk.id,
    systemId: machine.system_id,
  });
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});
