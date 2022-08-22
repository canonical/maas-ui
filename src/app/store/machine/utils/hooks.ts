import { useEffect, useState } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { nanoid } from "@reduxjs/toolkit";
import fastDeepEqual from "fast-deep-equal";
import { useDispatch, useSelector } from "react-redux";

import type { FetchSortDirection } from "../types/actions";

import { useCanEdit } from "app/base/hooks";
import type { APIError } from "app/base/types";
import { actions as generalActions } from "app/store/general";
import {
  architectures as architecturesSelectors,
  osInfo as osInfoSelectors,
} from "app/store/general/selectors";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  FetchFilters,
  Machine,
  MachineMeta,
  FetchGroupKey,
} from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { Host } from "app/store/types/host";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";
import { NodeStatus } from "app/store/types/node";
import {
  getLinkInterface,
  hasInterfaceType,
  isNodeStorageConfigurable,
} from "app/store/utils";
import vlanSelectors from "app/store/vlan/selectors";
import { isId } from "app/utils";

export const useFetchMachineCount = (
  filters?: FetchFilters
): {
  machineCount: number;
  machineCountLoading: boolean;
  machineCountLoaded: boolean;
} => {
  const [callId, setCallId] = useState<string | null>(null);
  const previousCallId = usePrevious(callId);
  const previousFilters = usePrevious(filters);
  const dispatch = useDispatch();
  const machineCount = useSelector((state: RootState) =>
    machineSelectors.count(state, callId)
  );
  const machineCountLoading = useSelector((state: RootState) =>
    machineSelectors.countLoading(state, callId)
  );
  const machineCountLoaded = useSelector((state: RootState) =>
    machineSelectors.countLoaded(state, callId)
  );

  useEffect(() => {
    // undefined, null and {} are all equivalent i.e. no filters so compare the
    // current and previous filters using an empty object if the filters are falsy.
    if (!fastDeepEqual(filters || {}, previousFilters || {}) || !callId) {
      setCallId(nanoid());
    }
  }, [callId, dispatch, filters, previousFilters]);

  useEffect(() => {
    return () => {
      if (callId) {
        dispatch(machineActions.removeRequest(callId));
      }
    };
  }, [callId, dispatch]);

  useEffect(() => {
    if (callId && callId !== previousCallId) {
      dispatch(machineActions.count(callId, filters));
    }
  }, [dispatch, filters, callId, previousCallId]);

  return {
    machineCount: machineCount || 0,
    machineCountLoading,
    machineCountLoaded,
  };
};

/**
 * Fetch machines via the API.
 */
export const useFetchMachines = (
  filters?: FetchFilters | null,
  grouping?: FetchGroupKey | null,
  pageSize?: number,
  currentPage?: number,
  sortKey?: FetchGroupKey | null,
  sortDirection?: FetchSortDirection | null
): {
  callId: string | null;
  loaded: boolean;
  loading: boolean;
  machineCount: number | null;
  machines: Machine[];
  machinesErrors: APIError;
} => {
  const [callId, setCallId] = useState<string | null>(null);
  const previousCallId = usePrevious(callId);
  const previousFilters = usePrevious(filters, false);
  const previousGrouping = usePrevious(grouping, false);
  const previousSortDirection = usePrevious(sortDirection, false);
  const previousSortKey = usePrevious(sortKey, false);
  const previousPage = usePrevious(currentPage, false);
  const previousPageSize = usePrevious(pageSize, false);
  const dispatch = useDispatch();
  const machines = useSelector((state: RootState) =>
    machineSelectors.list(state, callId)
  );
  const machineCount = useSelector((state: RootState) =>
    machineSelectors.listCount(state, callId)
  );
  const machinesErrors = useSelector((state: RootState) =>
    machineSelectors.listErrors(state, callId)
  );
  const loaded = useSelector((state: RootState) =>
    machineSelectors.listLoaded(state, callId)
  );
  const loading = useSelector((state: RootState) =>
    machineSelectors.listLoading(state, callId)
  );
  useCleanup(callId);

  useEffect(() => {
    // TODO: request the machines again if the provided options change (
    // ordering, pagination etc.)
    // undefined, null and {} are all equivalent i.e. no filters so compare the
    // current and previous filters using an empty object if the filters are falsy.
    if (
      !fastDeepEqual(filters || {}, previousFilters || {}) ||
      !callId ||
      grouping !== previousGrouping ||
      sortKey !== previousSortKey ||
      sortDirection !== previousSortDirection ||
      currentPage !== previousPage ||
      pageSize !== previousPageSize
    ) {
      setCallId(nanoid());
    }
  }, [
    callId,
    currentPage,
    dispatch,
    filters,
    grouping,
    pageSize,
    previousFilters,
    previousGrouping,
    previousPage,
    previousPageSize,
    previousSortDirection,
    previousSortKey,
    sortDirection,
    sortKey,
  ]);

  useEffect(() => {
    if (callId && callId !== previousCallId) {
      dispatch(
        machineActions.fetch(
          callId,
          filters ||
            grouping ||
            sortKey ||
            sortDirection ||
            grouping ||
            pageSize
            ? {
                filter: filters ?? null,
                group_key: grouping ?? null,
                page_number: currentPage,
                page_size: pageSize,
                sort_direction: sortDirection ?? null,
                sort_key: sortKey ?? null,
              }
            : null
        )
      );
    }
  }, [
    callId,
    currentPage,
    dispatch,
    filters,
    grouping,
    pageSize,
    previousCallId,
    sortDirection,
    sortKey,
  ]);

  return { callId, loaded, loading, machineCount, machines, machinesErrors };
};

/**
 * Fetch a machine via the API.
 * @param id - A machine's system id.
 */
export const useFetchMachine = (
  id?: Machine[MachineMeta.PK] | null
): { machine: Machine | null; loading?: boolean; loaded?: boolean } => {
  const [callId, setCallId] = useState<string | null>(null);
  const previousId = usePrevious(id, false);
  const previousCallId = usePrevious(callId);
  const dispatch = useDispatch();
  const loaded = useSelector((state: RootState) =>
    machineSelectors.detailsLoaded(state, callId)
  );
  const loading = useSelector((state: RootState) =>
    machineSelectors.detailsLoading(state, callId)
  );
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  useCleanup(callId);

  useEffect(() => {
    if (isId(id) && id !== previousId) {
      const newId = nanoid();
      setCallId(newId);
    }
  }, [dispatch, id, previousId]);

  useEffect(() => {
    if (isId(id) && callId && callId !== previousCallId) {
      dispatch(machineActions.get(id, callId));
    }
  }, [dispatch, id, callId, previousCallId]);

  return { machine, loading, loaded };
};

/**
 * Unsubscribe from machines if they're no longer being used.
 */
const useCleanup = (callId: string | null): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (callId) {
        dispatch(machineActions.cleanupRequest(callId));
      }
    };
  }, [callId, dispatch]);
};

/**
 * Check whether a machine's storage can be edited based on permissions and the
 * machine's status.
 * @param machine - A machine object.
 * @returns Whether the machine's storage can be edited.
 */
export const useCanEditStorage = (machine: Machine | null): boolean => {
  const canEdit = useCanEdit(machine);
  const machineStorageConfigurable = isNodeStorageConfigurable(machine);
  return canEdit && machineStorageConfigurable;
};

/**
 * Format a node's OS and release into human-readable text.
 * @param node - A node object.
 * @param hideUbuntuTitle - Whether to hide the title of the Ubuntu release
 * @returns Formatted OS string.
 */
export const useFormattedOS = (
  node?: Host | null,
  hideUbuntuTitle?: boolean
): string => {
  const dispatch = useDispatch();
  const loading = useSelector(osInfoSelectors.loading);
  const osReleases = useSelector((state: RootState) =>
    osInfoSelectors.getOsReleases(state, node?.osystem)
  );

  useEffect(() => {
    dispatch(generalActions.fetchOsInfo());
  }, [dispatch]);

  if (!node || !node.osystem || !node.distro_series || loading) {
    return "";
  }

  const machineRelease = osReleases.find(
    (release) => release.value === node.distro_series
  );
  if (machineRelease) {
    return node.osystem === "ubuntu" && hideUbuntuTitle
      ? machineRelease.label.split('"')[0].trim()
      : machineRelease.label;
  }
  return `${node.osystem}/${node.distro_series}`;
};

/**
 * Check if a machine has an invalid architecture.
 * @param machine - A machine object.
 * @returns Whether the machine has an invalid architecture.
 */
export const useHasInvalidArchitecture = (
  machine?: Machine | null
): boolean => {
  const dispatch = useDispatch();
  const architectures = useSelector(architecturesSelectors.get);

  useEffect(() => {
    dispatch(generalActions.fetchArchitectures());
  }, [dispatch]);

  if (!machine) {
    return false;
  }

  return (
    machine.architecture === "" || !architectures.includes(machine.architecture)
  );
};

/**
 * Check if only the name or mac address of an interface can
 * be edited.
 * @param nic - A network interface.
 * @param machine - A machine.
 * @return Whether limited editing is allowed.
 */
export const useIsLimitedEditingAllowed = (
  nic: NetworkInterface | null | undefined,
  machine: Machine | null | undefined,
  link?: NetworkLink | null
): boolean => {
  const canEdit = useCanEdit(machine);
  if (!canEdit || !machine) {
    return false;
  }
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  return (
    !!nic &&
    machine?.status === NodeStatus.DEPLOYED &&
    !hasInterfaceType(NetworkInterfaceTypes.VLAN, machine, nic, link)
  );
};

/**
 * Check if a VLAN can be added to the interface.
 * @param machine - A machine.
 * @param nic - A network interface.
 * @return Whether limited editing is allowed.
 */
export const useCanAddVLAN = (
  machine?: Machine | null,
  nic?: NetworkInterface | null,
  link?: NetworkLink | null
): boolean => {
  const unusedVLANs = useSelector((state: RootState) =>
    vlanSelectors.getUnusedForInterface(state, machine, nic)
  );
  if (
    !machine ||
    !nic ||
    hasInterfaceType(
      [NetworkInterfaceTypes.ALIAS, NetworkInterfaceTypes.VLAN],
      machine,
      nic,
      link
    )
  ) {
    return false;
  }
  // Check that there are unused VLANS available.
  return unusedVLANs.length > 0;
};
