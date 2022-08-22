import type { ReactNode } from "react";

import reduxToolkit from "@reduxjs/toolkit";
import { renderHook, cleanup } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import {
  useCanAddVLAN,
  useCanEditStorage,
  useFormattedOS,
  useHasInvalidArchitecture,
  useIsLimitedEditingAllowed,
  useFetchMachine,
  useFetchMachines,
  useFetchMachineCount,
} from "./hooks";

import { actions as machineActions } from "app/store/machine";
import type { FetchFilters, Machine } from "app/store/machine/types";
import { FetchGroupKey, FetchSortDirection } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import { NodeStatus, NodeStatusCode } from "app/store/types/node";
import {
  architecturesState as architecturesStateFactory,
  fabric as fabricFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineEvent as machineEventFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStateDetailsItem as machineStateDetailsItemFactory,
  machineStateList as machineStateListFactory,
  machineStateListGroup as machineStateListGroupFactory,
  machineStateCount as machineStateCountFactory,
  machineStateCounts as machineStateCountsFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
} from "testing/factories";

const mockStore = configureStore();

type UseFetchMachinesProps = {
  filters?: FetchFilters | null;
  grouping?: FetchGroupKey | null;
  sortKey?: FetchGroupKey | null;
  sortDirection?: FetchSortDirection | null;
  pageSize?: number;
  currentPage?: number;
};

const generateWrapper =
  (store: MockStoreEnhanced<unknown>) =>
  ({ children }: { children: ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("useFetchMachineCount", () => {
    beforeEach(() => {
      jest
        .spyOn(reduxToolkit, "nanoid")
        .mockReturnValueOnce("mocked-nanoid-1")
        .mockReturnValueOnce("mocked-nanoid-2")
        .mockReturnValueOnce("mocked-nanoid-3");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    const generateWrapper =
      (store: MockStoreEnhanced<unknown>) =>
      ({ children }: { children?: ReactNode; filters?: FetchFilters }) =>
        <Provider store={store}>{children}</Provider>;

    it("can dispatch machine count action", () => {
      const store = mockStore(state);
      renderHook(() => useFetchMachineCount(), {
        wrapper: generateWrapper(store),
      });
      const expected = machineActions.count("mocked-nanoid-1");
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected);
    });

    it("returns the machine count", async () => {
      jest.restoreAllMocks();
      jest.spyOn(reduxToolkit, "nanoid").mockReturnValueOnce("mocked-nanoid");
      const machineCount = 2;
      const counts = machineStateCountsFactory({
        "mocked-nanoid": machineStateCountFactory({
          count: machineCount,
          loaded: true,
          loading: false,
        }),
      });
      state.machine = machineStateFactory({
        loaded: true,
        counts,
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useFetchMachineCount(), {
        wrapper: generateWrapper(store),
      });
      expect(result.current.machineCountLoaded).toBe(true);
      expect(result.current.machineCount).toStrictEqual(machineCount);
    });

    it("does not fetch again with no params", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(() => useFetchMachineCount(), {
        wrapper: generateWrapper(store),
      });
      rerender();
      const expected = machineActions.count("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("does not fetch again if the filters haven't changed", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        () => useFetchMachineCount({ hostname: "spotted-quoll" }),
        {
          wrapper: generateWrapper(store),
        }
      );
      rerender({ filters: { hostname: "spotted-quoll" } });
      const expected = machineActions.count("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("fetches again if the filters change", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({ filters }) => useFetchMachineCount(filters),
        {
          initialProps: {
            filters: {
              hostname: "spotted-quoll",
            },
          },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ filters: { hostname: "eastern-quoll" } });
      const expected = machineActions.count("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(2);
    });
  });

  describe("useFetchMachines", () => {
    beforeEach(() => {
      jest
        .spyOn(reduxToolkit, "nanoid")
        .mockReturnValueOnce("mocked-nanoid-1")
        .mockReturnValueOnce("mocked-nanoid-2")
        .mockReturnValueOnce("mocked-nanoid-3");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    const generateWrapper =
      (store: MockStoreEnhanced<unknown>) =>
      ({
        children,
      }: UseFetchMachinesProps & {
        children?: ReactNode;
      }) =>
        <Provider store={store}>{children}</Provider>;

    it("can fetch machines", () => {
      const store = mockStore(state);
      renderHook(() => useFetchMachines(), {
        wrapper: generateWrapper(store),
      });
      const expected = machineActions.fetch("mocked-nanoid-1");
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected);
    });

    it("returns the fetched machines", () => {
      const machines = [machineFactory(), machineFactory(), machineFactory()];
      state.machine = machineStateFactory({
        loaded: true,
        items: [...machines, machineFactory()],
        lists: {
          "mocked-nanoid-1": machineStateListFactory({
            loading: true,
            groups: [
              machineStateListGroupFactory({
                items: machines.map(({ system_id }) => system_id),
              }),
            ],
          }),
        },
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useFetchMachines(), {
        wrapper: generateWrapper(store),
      });
      expect(result.current.machines).toStrictEqual(machines);
    });

    it("returns the loaded and loading states", () => {
      state.machine = machineStateFactory({
        lists: {
          "mocked-nanoid-1": machineStateListFactory({
            loaded: false,
            loading: true,
          }),
        },
      });
      const store = mockStore(state);
      const { result } = renderHook(() => useFetchMachines(), {
        wrapper: generateWrapper(store),
      });
      expect(result.current.loaded).toBe(false);
      expect(result.current.loading).toBe(true);
    });

    it("does not fetch again with no params", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(() => useFetchMachines(), {
        wrapper: generateWrapper(store),
      });
      rerender();
      const expected = machineActions.fetch("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("does not fetch again if the filters haven't changed", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({ filters }: UseFetchMachinesProps) => useFetchMachines(filters),
        {
          initialProps: { filters: { hostname: "spotted-quoll" } },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ filters: { hostname: "spotted-quoll" } });
      const expected = machineActions.fetch("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("does not fetch again if the grouping hasn't changed", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: { grouping: FetchGroupKey.Owner },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ grouping: FetchGroupKey.Owner });
      const expected = machineActions.fetch("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("does not fetch again if the sort key hasn't changed", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: { sortKey: FetchGroupKey.Bmc },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ sortKey: FetchGroupKey.Bmc });
      const expected = machineActions.fetch("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("does not fetch again if the current page hasn't changed", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: { currentPage: 4 },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ currentPage: 4 });
      const expected = machineActions.fetch("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("does not fetch again if the sort direction hasn't changed", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: { sortDirection: FetchSortDirection.Ascending },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ sortDirection: FetchSortDirection.Ascending });
      const expected = machineActions.fetch("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("does not fetch again if the page size hasn't changed", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: { pageSize: 22 },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ pageSize: 22 });
      const expected = machineActions.fetch("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("does not fetch again if the filters haven't changed including empty objects", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({ filters }: UseFetchMachinesProps) => useFetchMachines(filters),
        {
          initialProps: { filters: null },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ filters: {} });
      const expected = machineActions.fetch("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("fetches again if the filters change", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: {
            filters: {
              hostname: "spotted-quoll",
            },
          },
          wrapper: generateWrapper(store),
        }
      );
      const expected = machineActions.fetch("mocked-nanoid-1");
      let getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
      rerender({ filters: { hostname: "eastern-quoll" } });
      getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(2);
    });

    it("fetches again if the grouping changes", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: {
            grouping: FetchGroupKey.Owner,
          },
          wrapper: generateWrapper(store),
        }
      );
      const expected = machineActions.fetch("mocked-nanoid-1");
      let getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
      rerender({ grouping: FetchGroupKey.Status });
      getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(2);
    });

    it("fetches again if the page size changes", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: {
            pageSize: 22,
          },
          wrapper: generateWrapper(store),
        }
      );
      const expected = machineActions.fetch("mocked-nanoid-1");
      let getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
      rerender({ pageSize: 44 });
      getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(2);
    });

    it("fetches again if the current page changes", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: {
            currentPage: 3,
          },
          wrapper: generateWrapper(store),
        }
      );
      const expected = machineActions.fetch("mocked-nanoid-1");
      let getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
      rerender({ currentPage: 6 });
      getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(2);
    });

    it("fetches again if the sort key changes", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: {
            sortKey: FetchGroupKey.Bmc,
          },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ sortKey: FetchGroupKey.AgentName });
      const expected = machineActions.fetch("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(2);
    });

    it("fetches again if the sort direction changes", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({
          filters,
          grouping,
          pageSize,
          currentPage,
          sortKey,
          sortDirection,
        }: UseFetchMachinesProps) =>
          useFetchMachines(
            filters,
            grouping,
            pageSize,
            currentPage,
            sortKey,
            sortDirection
          ),
        {
          initialProps: {
            sortDirection: FetchSortDirection.Descending,
          },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ sortDirection: FetchSortDirection.Ascending });
      const expected = machineActions.fetch("mocked-nanoid-1");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(2);
    });

    it("cleans up list request on unmount", async () => {
      jest.spyOn(reduxToolkit, "nanoid").mockReturnValueOnce("mocked-nanoid-1");
      const store = mockStore(state);
      renderHook(() => useFetchMachines(), {
        wrapper: generateWrapper(store),
      });
      cleanup();
      const expected = machineActions.cleanupRequest("mocked-nanoid-1");
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected);
    });
  });

  describe("useFetchMachine", () => {
    beforeEach(() => {
      jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    const generateWrapper =
      (store: MockStoreEnhanced<unknown>) =>
      ({ children }: { children?: ReactNode; id: string }) =>
        <Provider store={store}>{children}</Provider>;

    it("can get a machine", () => {
      jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
      const store = mockStore(state);
      renderHook(
        ({ id }: { children?: ReactNode; id: string }) => useFetchMachine(id),
        {
          initialProps: {
            id: "def456",
          },
          wrapper: generateWrapper(store),
        }
      );
      const expected = machineActions.get("def456", "mocked-nanoid");
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected);
    });

    it("does not fetch again if the id hasn't changed", () => {
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({ id }: { children?: ReactNode; id: string }) => useFetchMachine(id),
        {
          initialProps: {
            id: "def456",
          },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ id: "def456" });
      const expected = machineActions.get("def456", "mocked-nanoid");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(1);
    });

    it("gets a machine if the id changes", () => {
      jest
        .spyOn(reduxToolkit, "nanoid")
        .mockReturnValueOnce("mocked-nanoid-1")
        .mockReturnValueOnce("mocked-nanoid-2");
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({ id }: { children?: ReactNode; id: string }) => useFetchMachine(id),
        {
          initialProps: {
            id: "def456",
          },
          wrapper: generateWrapper(store),
        }
      );
      rerender({ id: "ghi789" });
      const expected = machineActions.get("ghi789", "mocked-nanoid-2");
      const getDispatches = store
        .getActions()
        .filter((action) => action.type === expected.type);
      expect(getDispatches).toHaveLength(2);
      expect(getDispatches[1]).toStrictEqual(expected);
    });

    it("returns the machine and loading states", () => {
      jest.spyOn(reduxToolkit, "nanoid").mockReturnValueOnce("mocked-nanoid-1");
      const machine = machineFactory({
        system_id: "abc123",
      });
      state.machine = machineStateFactory({
        items: [machine, machineFactory()],
        details: {
          "mocked-nanoid-1": machineStateDetailsItemFactory({
            loaded: true,
            loading: true,
            system_id: "abc123",
          }),
        },
      });
      const store = mockStore(state);
      const { result } = renderHook(
        ({ id }: { children?: ReactNode; id: string }) => useFetchMachine(id),
        {
          initialProps: {
            id: "abc123",
          },
          wrapper: generateWrapper(store),
        }
      );
      expect(result.current.loaded).toBe(true);
      expect(result.current.loading).toBe(true);
      expect(result.current.machine).toStrictEqual(machine);
    });

    it("cleans up machine request on unmount", async () => {
      jest.spyOn(reduxToolkit, "nanoid").mockReturnValueOnce("mocked-nanoid-1");
      const store = mockStore(state);
      renderHook(
        ({ id }: { children?: ReactNode; id: string }) => useFetchMachine(id),
        {
          initialProps: {
            id: "def456",
          },
          wrapper: generateWrapper(store),
        }
      );
      cleanup();
      const expected = machineActions.cleanupRequest("mocked-nanoid-1");
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected);
    });

    it("cleans up machine requests when the id changes", async () => {
      jest
        .spyOn(reduxToolkit, "nanoid")
        .mockReturnValueOnce("mocked-nanoid-1")
        .mockReturnValueOnce("mocked-nanoid-2");
      const store = mockStore(state);
      const { rerender } = renderHook(
        ({ id }: { children?: ReactNode; id: string }) => useFetchMachine(id),
        {
          initialProps: {
            id: "def123",
          },
          wrapper: generateWrapper(store),
        }
      );

      const expected1 = machineActions.cleanupRequest("mocked-nanoid-1");
      const expected2 = machineActions.cleanupRequest("mocked-nanoid-2");
      const getCleanupActions = () =>
        store.getActions().filter((action) => action.type === expected1.type);

      rerender({ id: "def456" });
      expect(getCleanupActions()).toHaveLength(1);
      cleanup();
      expect(getCleanupActions()).toHaveLength(2);
      expect(getCleanupActions()[0]).toStrictEqual(expected1);
      expect(getCleanupActions()[1]).toStrictEqual(expected2);
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

    it("does not return anything if os info is loading", () => {
      state.machine.items[0].osystem = "ubuntu";
      state.machine.items[0].distro_series = "focal";
      state.general.osInfo.loading = true;
      const store = mockStore(state);
      const { result } = renderHook(() => useFormattedOS(machine), {
        wrapper: generateWrapper(store),
      });

      expect(result.current).toBe("");
    });

    it("can show the full Ubuntu release", () => {
      state.machine.items[0].osystem = "ubuntu";
      state.machine.items[0].distro_series = "focal";
      state.general.osInfo.data = osInfoFactory({
        releases: [["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"']],
      });
      const store = mockStore(state);

      const { result } = renderHook(() => useFormattedOS(machine), {
        wrapper: generateWrapper(store),
      });

      expect(result.current).toBe('Ubuntu 20.04 LTS "Focal Fossa"');
    });

    it("can show the short-form for Ubuntu releases", () => {
      state.machine.items[0].osystem = "ubuntu";
      state.machine.items[0].distro_series = "focal";
      state.general.osInfo.data = osInfoFactory({
        releases: [["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"']],
      });
      const store = mockStore(state);

      const { result } = renderHook(() => useFormattedOS(machine, true), {
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
