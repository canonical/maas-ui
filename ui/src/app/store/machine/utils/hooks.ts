import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { isMachineStorageConfigurable } from "./storage";

import { useCanEdit } from "app/base/hooks";
import { actions as generalActions } from "app/store/general";
import {
  architectures as architecturesSelectors,
  osInfo as osInfoSelectors,
} from "app/store/general/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { Host } from "app/store/types/host";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";
import { NodeStatus } from "app/store/types/node";
import { getLinkInterface, hasInterfaceType } from "app/store/utils";
import vlanSelectors from "app/store/vlan/selectors";

/**
 * Check whether a machine's storage can be edited based on permissions and the
 * machine's status.
 * @param machine - A machine object.
 * @returns Whether the machine's storage can be edited.
 */
export const useCanEditStorage = (machine: Machine | null): boolean => {
  const canEdit = useCanEdit(machine);
  const machineStorageConfigurable = isMachineStorageConfigurable(machine);
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
