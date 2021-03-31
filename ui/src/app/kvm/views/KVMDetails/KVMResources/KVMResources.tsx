import { useEffect } from "react";
import * as React from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import KVMNumaResources from "./KVMNumaResources";

import Switch from "app/base/components/Switch";
import { useSendAnalytics, useWindowTitle } from "app/base/hooks";
import PodAggregateResources from "app/kvm/components/PodAggregateResources";
import PodStorage from "app/kvm/components/PodStorage";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
};

const KVMResources = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const [viewByNuma, setViewByNuma] = useStorageState(
    localStorage,
    `viewPod${id}ByNuma`,
    false
  );

  const sendAnalytics = useSendAnalytics();

  useWindowTitle(`KVM resources ${pod?.name || ""}`);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  if (!!pod) {
    return (
      <>
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

export default KVMResources;
