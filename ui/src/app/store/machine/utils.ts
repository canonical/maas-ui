import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { general as generalActions } from "app/base/actions";
import { nodeStatus } from "app/base/enum";
import generalSelectors from "app/store/general/selectors";
import type { Machine, NetworkInterface } from "app/store/machine/types";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { Host } from "app/store/types/host";
import { NodeStatus } from "app/store/types/node";

/**
 * Check if a machine has an invalid architecture.
 * @param machine - A machine object.
 * @returns Whether the machine has an invalid architecture.
 */
export const useHasInvalidArchitecture = (
  machine?: Machine | null
): boolean => {
  const dispatch = useDispatch();
  const architectures = useSelector(generalSelectors.architectures.get);

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
 * Check if the rack controller is connected.
 * @returns Whether the rack controller is connected.
 */
export const useIsRackControllerConnected = (): boolean => {
  const dispatch = useDispatch();
  const powerTypes = useSelector(generalSelectors.powerTypes.get);

  useEffect(() => {
    dispatch(generalActions.fetchPowerTypes());
  }, [dispatch]);

  // If power types exist then a rack controller is connected.
  return powerTypes.length > 0;
};

/**
 * Check if a machine can be edited.
 * @param machine - A machine object.
 * @param ignoreRackControllerConnection - Whether the editable check should
 *                                         include whether the rack controller
 *                                          is connected.
 * @returns Whether the machine can be edited.
 */
export const useCanEdit = (
  machine?: Machine | null,
  ignoreRackControllerConnection = false
): boolean => {
  const isRackControllerConnected = useIsRackControllerConnected();
  if (!machine) {
    return false;
  }
  return (
    machine.permissions.includes("edit") &&
    !machine.locked &&
    (ignoreRackControllerConnection || isRackControllerConnected)
  );
};

/**
 * Format a node's OS and release into human-readable text.
 * @param node - A node object.
 * @returns Formatted OS string.
 */
export const useFormattedOS = (node?: Host | null): string => {
  const dispatch = useDispatch();
  const osReleases = useSelector((state: RootState) =>
    generalSelectors.osInfo.getOsReleases(state, node?.osystem)
  );

  useEffect(() => {
    dispatch(generalActions.fetchOsInfo());
  }, [dispatch]);

  if (!node || !node.osystem || !node.distro_series) {
    return "";
  }

  const machineRelease = osReleases.find(
    (release) => release.value === node.distro_series
  );
  if (machineRelease) {
    return node.osystem === "ubuntu"
      ? machineRelease.label.split('"')[0].trim()
      : machineRelease.label;
  }
  return `${node.osystem}/${node.distro_series}`;
};

/**
 * Check whether a machine's status allows storage configuration.
 * @param machine - A machine object.
 * @returns Whether the machine's status allows storage configuration.
 */
export const isMachineStorageConfigurable = (
  machine?: Machine | null
): boolean =>
  !!machine &&
  [nodeStatus.READY, nodeStatus.ALLOCATED].includes(machine.status_code);

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
 * Check whether a machine's OS allows storage configuration.
 * @param machine - A machine object.
 * @returns Whether the machine's OS allows storage configuration.
 */
export const canOsSupportStorageConfig = (machine?: Machine | null): boolean =>
  !!machine && ["centos", "rhel", "ubuntu"].includes(machine.osystem);

/**
 * Check whether a machine's OS supports bcache and ZFS.
 * @param machine - A machine object.
 * @returns Whether the machine's OS supports bcache and ZFS.
 */
export const canOsSupportBcacheZFS = (machine?: Machine | null): boolean =>
  !!machine && machine.osystem === "ubuntu";

export const getPodNumaID = (machine: Machine, pod: Pod): number | null => {
  if (pod?.numa_pinning) {
    // If there is only one NUMA node on the VM host, then the VM must be
    // aligned on that node even if it isn't specifically pinned.
    if (pod.numa_pinning.length === 1) {
      return pod.numa_pinning[0].node_id;
    }
    const podNuma = pod.numa_pinning.find((numa) =>
      numa.vms.some((vm) => vm.system_id === machine.system_id)
    );
    if (podNuma) {
      return podNuma.node_id;
    }
  }
  return null;
};

/**
 * Check if the networking information can be edited.
 * @return Wether networking is disabled.
 */
export const useIsAllNetworkingDisabled = (
  machine?: Machine | null
): boolean => {
  const canEdit = useCanEdit(machine, true);
  return (
    !canEdit ||
    !machine ||
    ![
      NodeStatus.NEW,
      NodeStatus.READY,
      NodeStatus.FAILED_TESTING,
      NodeStatus.ALLOCATED,
      NodeStatus.BROKEN,
    ].includes(machine.status)
  );
};

/**
 * Check the interface is the boot interface or has a parent
 * that is a boot interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @return Whether this is a boot interface.
 */
export const getInterfaceMembers = (
  machine: Machine,
  nic: NetworkInterface
): NetworkInterface[] => {
  if (
    !nic ||
    !machine ||
    !("interfaces" in machine) ||
    ![NetworkInterfaceTypes.BOND, NetworkInterfaceTypes.BRIDGE].includes(
      nic.type
    )
  ) {
    return [];
  }
  return nic.parents.reduce<NetworkInterface[]>((parents, parent) => {
    const match = machine.interfaces.find(({ id }) => id && id === parent);
    if (match) {
      parents.push(match);
    }
    return parents;
  }, []);
};

/**
 * Check the interface is the boot interface or has a parent
 * that is a boot interface.
 * @param machine - The nic's machine.
 * @param nic - A network interface.
 * @return Whether this is a boot interface.
 */
export const isBootInterface = (
  machine: Machine,
  nic: NetworkInterface
): boolean => {
  if (!nic || !machine) {
    return false;
  }
  if (nic.is_boot && nic.type !== NetworkInterfaceTypes.ALIAS) {
    return true;
  }
  const members = getInterfaceMembers(machine, nic);
  return members.some(({ is_boot }) => is_boot);
};
