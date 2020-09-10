import { Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "app/store/root/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import KVMResourcesCard from "app/kvm/components/KVMResourcesCard";
import { formatBytes } from "app/utils";

type Props = { id: number };

const KVMAggregateResources = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  if (!!pod) {
    const totalCores = pod.total.cores * pod.cpu_over_commit_ratio;

    return (
      <KVMResourcesCard
        className="kvm-resources-card--aggregate"
        cores={{
          allocated: pod.used.cores,
          free: totalCores - pod.used.cores,
        }}
        ram={{
          general: {
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
        }}
        vms={[]}
      />
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMAggregateResources;
