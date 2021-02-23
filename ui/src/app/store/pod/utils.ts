import type { Machine } from "app/store/machine/types";
import type { Pod } from "app/store/pod/types";

export const formatHostType = (type: string): string => {
  switch (type) {
    case "lxd":
      return "LXD";
    case "virsh":
      return "Virsh";
    default:
      return type;
  }
};

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

export const getVMHostCount = (
  kvmCount: number,
  selectedKVMCount: number
): string => {
  const kvmCountString = `${kvmCount} VM host${kvmCount === 1 ? "" : "s"}`;
  if (selectedKVMCount > 0) {
    if (kvmCount === selectedKVMCount) {
      return "All VM hosts selected";
    }
    return `${selectedKVMCount} of ${kvmCountString} selected`;
  }
  return `${kvmCountString} available`;
};
