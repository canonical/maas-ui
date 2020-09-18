import { Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Machine } from "app/store/machine/types";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { KVMResourcesCardProps } from "app/kvm/components/KVMResourcesCard";
import { machine as machineActions } from "app/base/actions";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import KVMResourcesCard from "app/kvm/components/KVMResourcesCard";
import { formatBytes } from "app/utils";

type Props = { id: number };

/**
 * Normalise pod data for use in KVMResourcesCard component.
 * @param pod - the pod whose resources are to be normalised
 */
const normaliseResources = (
  pod: Pod,
  vms: Machine[]
): KVMResourcesCardProps => {
  // Start by normalising the resources on the pod object itself.
  const normalisedResources: KVMResourcesCardProps = {
    cores: {
      allocated: pod.used.cores,
      free: pod.total.cores * pod.cpu_over_commit_ratio - pod.used.cores,
    },
    ram: {
      general: {
        // Convert to B for easier calculations with hugepages
        allocated: formatBytes(pod.used.memory, "MiB", {
          binary: true,
          convertTo: "B",
        }).value,
        free: formatBytes(
          pod.total.memory * pod.memory_over_commit_ratio - pod.used.memory,
          "MiB",
          { binary: true, convertTo: "B" }
        ).value,
      },
    },
    vms,
  };

  // Add additional data if the pod is NUMA-aware.
  if (pod.numa_pinning && pod.numa_pinning.length >= 1) {
    const normalisedInterfaces: KVMResourcesCardProps["interfaces"] = [];
    const normalisedHugepages: KVMResourcesCardProps["ram"]["hugepages"] = [];

    pod.numa_pinning.forEach((numaNode) => {
      const { interfaces, memory } = numaNode;

      if (interfaces?.length >= 1) {
        interfaces.forEach((iface) => {
          // Only add an interface to the list once in the off chance it spans
          // multiple nodes.
          if (!normalisedInterfaces.some((i) => i.id === iface.id)) {
            normalisedInterfaces.push({
              id: iface.id,
              name: iface.name,
              virtualFunctions: iface.virtual_functions,
            });
          }
        });
      }
      if (memory.hugepages?.length >= 1) {
        memory.hugepages.forEach((hugepage) => {
          // If multiple of the same hugepage pageSize exist across nodes,
          // sum them together. Otherwise add a new entry.
          const i = normalisedHugepages.findIndex(
            (hp) => hp.pageSize === hugepage.page_size
          );
          if (i >= 0) {
            normalisedHugepages[i].allocated += hugepage.allocated;
            normalisedHugepages[i].free += hugepage.free;
          } else {
            normalisedHugepages.push({
              allocated: hugepage.allocated,
              free: hugepage.free,
              pageSize: hugepage.page_size,
            });
          }
        });
      }
    });

    normalisedResources.interfaces = normalisedInterfaces;
    normalisedResources.ram.hugepages = normalisedHugepages;
  }

  return normalisedResources;
};

const KVMAggregateResources = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const vms = useSelector((state: RootState) =>
    podSelectors.getVMs(state, pod)
  );

  useEffect(() => {
    dispatch(machineActions.fetch());
    dispatch(podActions.fetch());
  }, [dispatch]);

  if (!!pod) {
    const resources = normaliseResources(pod, vms);

    return (
      <KVMResourcesCard
        className="kvm-resources-card--aggregate"
        {...resources}
      />
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMAggregateResources;
