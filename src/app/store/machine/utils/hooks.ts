import { useEffect, useMemo, useState } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { nanoid } from "@reduxjs/toolkit";
import fastDeepEqual from "fast-deep-equal";
import { useDispatch, useSelector } from "react-redux";

import type {
  FetchGroupKey,
  FetchSortDirection,
  FetchParams,
} from "../types/actions";

import { useCanEdit, usePreviousPersistent } from "app/base/hooks";
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
  filters?: FetchFilters | null
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

export type UseFetchMachinesOptions = {
  filters?: FetchFilters | null;
  grouping?: FetchGroupKey | null;
  sortKey?: FetchGroupKey | null;
  sortDirection?: FetchSortDirection | null;
  collapsedGroups?: FetchParams["group_collapsed"];
  pagination?: {
    pageSize: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  };
};

/**
 * Fetch machines via the API.
 */
export const useFetchMachines = (
  options?: UseFetchMachinesOptions | null
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
  const previousOptions = usePrevious(options, false);
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

  // reset pagination when filters change
  const { filters, grouping, collapsedGroups, sortDirection, sortKey } =
    options || {};
  const filterOptions = useMemo(
    () => ({
      filters,
      grouping,
      collapsedGroups,
      sortDirection,
      sortKey,
    }),
    [filters, grouping, collapsedGroups, sortDirection, sortKey]
  );
  const previousFilterOptions = usePrevious(filterOptions);
  useEffect(() => {
    if (!fastDeepEqual(filterOptions, previousFilterOptions)) {
      options?.pagination?.setCurrentPage?.(1);
    }
  }, [options, filterOptions, previousFilterOptions]);

  useEffect(() => {
    // undefined, null and {} are all equivalent i.e. no filters so compare the
    // current and previous filters using an empty object if the filters are falsy.
    if (!fastDeepEqual(options || {}, previousOptions || {}) || !callId) {
      setCallId(nanoid());
    }
  }, [callId, options, previousOptions]);

  useEffect(() => {
    if (callId && callId !== previousCallId) {
      dispatch(
        machineActions.fetch(
          callId,
          options
            ? {
                filter: options.filters ?? null,
                group_collapsed: options.collapsedGroups,
                group_key: options.grouping ?? null,
                page_number: options?.pagination?.currentPage,
                page_size: options?.pagination?.pageSize,
                sort_direction: options.sortDirection ?? null,
                sort_key: options.sortKey ?? null,
              }
            : null
        )
      );
    }
  }, [callId, dispatch, options, previousCallId]);

  return { callId, loaded, loading, machineCount, machines, machinesErrors };
};

/**
 * Fetch a machine via the API.
 * @param id - A machine's system id.
 */
export const useFetchMachine = (
  id?: Machine[MachineMeta.PK] | null,
  options: { keepPreviousData?: boolean } = { keepPreviousData: false }
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
  const previousMachine = usePreviousPersistent(machine);
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

  return {
    machine: machine || (options.keepPreviousData ? previousMachine : null),
    loading,
    loaded,
  };
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

/**
 * Whether any machines are selected.
 */
export const useHasSelection = (): boolean => {
  const selectedMachines = useSelector(machineSelectors.selectedMachines);
  if (!selectedMachines) {
    return false;
  }
  // Check if the filter param is set. The just checks for a truthy value (instead
  // of checking if there are any keys) as an empty object is equivalent to
  // "select all".
  const hasFilters = "filter" in selectedMachines && !!selectedMachines.filter;
  const hasGroups =
    "groups" in selectedMachines && (selectedMachines.groups ?? [])?.length > 0;
  const hasItems =
    "items" in selectedMachines && (selectedMachines.items ?? [])?.length > 0;
  return hasFilters || hasGroups || hasItems;
};

/**
 * Return the previous count while a new fetch is in progress.
 */
export const useFetchedCount = (
  newCount: number | null,
  loading?: boolean | null
): number => {
  const [previousCount, setPreviousCount] = useState(newCount);
  const count = (loading ? previousCount : newCount) ?? 0;

  useEffect(() => {
    // The pagination needs to be displayed while the new list is being fetched
    // so this stores the previous machine count while the request is in progress.
    if ((newCount || newCount === 0) && previousCount !== newCount) {
      setPreviousCount(newCount);
    }
  }, [newCount, previousCount]);

  return count;
};
