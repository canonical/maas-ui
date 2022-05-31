import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CacheSetsTable from "./CacheSetsTable";

import { actions as machineActions } from "app/store/machine";
import { DiskTypes } from "app/store/types/enum";
import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("only shows disks that are cache sets", () => {
  const [cacheSet, notCacheSet] = [
    diskFactory({
      name: "quiche",
      type: DiskTypes.CACHE_SET,
    }),
    diskFactory({
      name: "frittata",
      type: DiskTypes.PHYSICAL,
    }),
  ];
  const machine = machineDetailsFactory({
    disks: [cacheSet, notCacheSet],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <CacheSetsTable canEditStorage node={machine} />
    </Provider>
  );

  expect(screen.getAllByRole("gridcell", { name: "Name" })).toHaveLength(1);
  expect(screen.getByRole("gridcell", { name: "Name" })).toHaveTextContent(
    cacheSet.name
  );
});

it("does not show an action column if node is a controller", () => {
  const controller = controllerDetailsFactory({
    disks: [
      diskFactory({
        name: "quiche",
        type: DiskTypes.CACHE_SET,
      }),
    ],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <CacheSetsTable canEditStorage={false} node={controller} />
    </Provider>
  );

  expect(
    screen.queryByRole("columnheader", { name: "Actions" })
  ).not.toBeInTheDocument();
});

it("shows an action column if node is a machine", () => {
  const machine = machineDetailsFactory({
    disks: [
      diskFactory({
        name: "quiche",
        type: DiskTypes.CACHE_SET,
      }),
    ],
    system_id: "abc123",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <CacheSetsTable canEditStorage node={machine} />
    </Provider>
  );

  expect(
    screen.getByRole("columnheader", { name: "Actions" })
  ).toBeInTheDocument();
});

it("can delete a cache set if node is a machine", async () => {
  const disk = diskFactory({
    type: DiskTypes.CACHE_SET,
  });
  const machine = machineDetailsFactory({ disks: [disk], system_id: "abc123" });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <CacheSetsTable canEditStorage node={machine} />
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: /Take action/ }));
  await userEvent.click(
    screen.getByRole("button", { name: "Remove cache set..." })
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Remove cache set" })
  );

  const expectedAction = machineActions.deleteCacheSet({
    cacheSetId: disk.id,
    systemId: machine.system_id,
  });
  expect(
    screen.getByText("Are you sure you want to remove this cache set?")
  ).toBeInTheDocument();
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});
