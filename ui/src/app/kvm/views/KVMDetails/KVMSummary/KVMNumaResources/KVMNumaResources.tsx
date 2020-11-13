import { Button, Spinner } from "@canonical/react-components";
import classNames from "classnames";
import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Machine } from "app/store/machine/types";
import type { Pod, PodNumaNode } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { PodResourcesCardProps } from "app/kvm/components/PodResourcesCard";
import { actions as machineActions } from "app/store/machine";
import { useSendAnalytics } from "app/base/hooks";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import PodResourcesCard from "app/kvm/components/PodResourcesCard";

export const TRUNCATION_POINT = 4;

type Props = { id: Pod["id"] };

/**
 * Normalise numa_pinning data from API for use in PodResourcesCard component.
 *
 * @param numaNode - the NUMA node to normalise
 * @returns {PodResourcesCardProps}
 */
const normaliseNuma = (
  numaNode: PodNumaNode,
  podVMs: Machine[]
): PodResourcesCardProps => {
  const { cores, interfaces, memory, node_id, vms } = numaNode;
  const { general, hugepages } = memory;

  const normalisedInterfaces =
    interfaces?.map((iface) => ({
      id: iface.id,
      name: iface.name,
      virtualFunctions: iface.virtual_functions,
    })) || [];
  const normalisedHugepages =
    hugepages?.map((hugepage) => ({
      allocated: hugepage.allocated,
      free: hugepage.free,
      pageSize: hugepage.page_size,
    })) || [];
  const normalisedVMs =
    podVMs.filter((vm) => vms.some((v) => v.system_id === vm.system_id)) || [];

  return {
    cores: {
      allocated: cores.allocated.length,
      free: cores.free.length,
    },
    interfaces: normalisedInterfaces,
    ram: {
      general: {
        allocated: general.allocated,
        free: general.free,
      },
      hugepages: normalisedHugepages,
    },
    title: `NUMA node ${node_id}`,
    vms: normalisedVMs,
  };
};

const KVMNumaResources = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const podVMs = useSelector((state: RootState) =>
    podSelectors.getVMs(state, pod)
  );
  const [expanded, setExpanded] = useState(false);

  const sendAnalytics = useSendAnalytics();

  useEffect(() => {
    dispatch(machineActions.fetch());
    dispatch(podActions.fetch());
  }, [dispatch]);

  if (!!pod) {
    const numaNodes = pod.numa_pinning || [];
    const canBeTruncated = numaNodes.length > TRUNCATION_POINT;
    const shownNumaNodes =
      canBeTruncated && !expanded
        ? numaNodes.slice(0, TRUNCATION_POINT)
        : numaNodes;
    const showWideCards = numaNodes.length <= 2;

    return (
      <>
        <div
          className={classNames("numa-resources-grid", {
            "is-wide": showWideCards,
          })}
        >
          {shownNumaNodes.map((numa) => {
            const kvmResourcesCardProps = normaliseNuma(numa, podVMs);
            return (
              <PodResourcesCard
                className={
                  showWideCards ? "pod-resources-card--wide" : undefined
                }
                key={numa.node_id}
                {...kvmResourcesCardProps}
              />
            );
          })}
        </div>
        {canBeTruncated && (
          <div className="u-align--center">
            <Button
              appearance="base"
              data-test="show-more-numas"
              hasIcon
              onClick={() => {
                setExpanded(!expanded);
                sendAnalytics(
                  "KVM details",
                  "Toggle expanded NUMA nodes",
                  expanded ? "Show less NUMA nodes" : "Show more NUMA nodes"
                );
              }}
            >
              {expanded ? (
                <>
                  <span>Show less NUMA nodes</span>
                  <i className="p-icon--contextual-menu u-mirror--y"></i>
                </>
              ) : (
                <>
                  <span>
                    {pluralize(
                      "more NUMA node",
                      numaNodes.length - TRUNCATION_POINT,
                      true
                    )}
                  </span>
                  <i className="p-icon--contextual-menu"></i>
                </>
              )}
            </Button>
            <hr />
          </div>
        )}
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMNumaResources;
