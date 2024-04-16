import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CacheSetsTable from "./CacheSetsTable";

import { machineActions } from "@/app/store/machine";
import { DiskTypes } from "@/app/store/types/enum";
import * as factory from "@/testing/factories";
import { userEvent, render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("only shows disks that are cache sets", () => {
  const [cacheSet, notCacheSet] = [
    factory.nodeDisk({
      name: "quiche",
      type: DiskTypes.CACHE_SET,
    }),
    factory.nodeDisk({
      name: "frittata",
      type: DiskTypes.PHYSICAL,
    }),
  ];
  const machine = factory.machineDetails({
    disks: [cacheSet, notCacheSet],
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
      <CacheSetsTable canEditStorage node={machine} />
    </Provider>
  );

  expect(screen.getAllByRole("gridcell", { name: "Name" })).toHaveLength(1);
  expect(screen.getByRole("gridcell", { name: "Name" })).toHaveTextContent(
    cacheSet.name
  );
});

it("does not show an action column if node is a controller", () => {
  const controller = factory.controllerDetails({
    disks: [
      factory.nodeDisk({
        name: "quiche",
        type: DiskTypes.CACHE_SET,
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
      <CacheSetsTable canEditStorage={false} node={controller} />
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
        name: "quiche",
        type: DiskTypes.CACHE_SET,
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
      <CacheSetsTable canEditStorage node={machine} />
    </Provider>
  );

  expect(
    screen.getByRole("columnheader", { name: "Actions" })
  ).toBeInTheDocument();
});

it("can delete a cache set if node is a machine", async () => {
  const disk = factory.nodeDisk({
    type: DiskTypes.CACHE_SET,
  });
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
