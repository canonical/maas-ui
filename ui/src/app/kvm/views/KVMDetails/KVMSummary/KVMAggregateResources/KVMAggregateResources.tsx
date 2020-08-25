import { Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "app/store/root/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import KVMResourcesCard from "app/kvm/components/KVMResourcesCard";
import { formatBytes } from "app/utils";

const fakeHugepageRAM = {
  allocated: 10,
  free: 2,
  total: 12,
  pagesize: 2048,
  unit: "GiB",
};
const fakeNICs = ["eth0", "eth1", "eth2", "eth3"];
const fakeVFs = {
  allocated: 32,
  free: 224,
  total: 256,
};

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
    const totalGeneralRAM = formatBytes(
      pod.total.memory * pod.memory_over_commit_ratio,
      "MiB",
      { binary: true }
    );

    return (
      <KVMResourcesCard
        className="kvm-resources-card--aggregate"
        cores={{
          allocated: pod.used.cores,
          free: totalCores - pod.used.cores,
          total: totalCores,
        }}
        nics={fakeNICs}
        ram={{
          general: {
            allocated: formatBytes(pod.used.memory, "MiB", {
              binary: true,
              convertTo: totalGeneralRAM.unit,
            }).value,
            free: formatBytes(
              pod.total.memory * pod.memory_over_commit_ratio - pod.used.memory,
              "MiB",
              { binary: true, convertTo: totalGeneralRAM.unit }
            ).value,
            total: totalGeneralRAM.value,
            unit: totalGeneralRAM.unit,
          },
          hugepage: fakeHugepageRAM,
        }}
        vfs={fakeVFs}
      />
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMAggregateResources;
