import { Code, Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useStorageState } from "react-storage-hooks";

import type { RouteParams } from "app/base/types";
import KVMNumaResources from "./KVMNumaResources";
import Switch from "app/base/components/Switch";
import { useSendAnalytics, useWindowTitle } from "app/base/hooks";
import PodAggregateResources from "app/kvm/components/PodAggregateResources";
import PodStorage from "app/kvm/components/PodStorage";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";

const KVMSummary = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const [viewByNuma, setViewByNuma] = useStorageState(
    localStorage,
    `viewPod${id}ByNuma`,
    false
  );

  const sendAnalytics = useSendAnalytics();

  useWindowTitle(`KVM ${`${pod?.name} ` || ""} details`);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  if (!!pod) {
    return (
      <>
        <div className="u-flex">
          <p className="u-nudge-left">
            {pod.type === "virsh" ? "Virsh:" : "LXD URL:"}
          </p>
          <Code copyable className="u-flex--grow">
            {pod.power_address}
          </Code>
        </div>
        <hr className="u-sv1" />
        <div className="u-flex--between u-flex--column-x-small">
          <h4 className="u-sv1">Resources</h4>
          {pod.numa_pinning && pod.numa_pinning.length >= 1 && (
            <Switch
              checked={viewByNuma}
              className="p-switch--inline-label"
              data-test="numa-switch"
              label="View by NUMA node"
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                const checked = evt.target.checked;
                setViewByNuma(checked);
                sendAnalytics(
                  "KVM details",
                  "Toggle NUMA view",
                  checked ? "View by NUMA node" : "View aggregate"
                );
              }}
            />
          )}
        </div>
        {viewByNuma ? (
          <KVMNumaResources id={pod.id} />
        ) : (
          <PodAggregateResources id={pod.id} />
        )}
        <PodStorage id={pod.id} />
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMSummary;
