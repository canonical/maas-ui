import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import KVMStorageCards from "./KVMStorageCards";
import NumaResources from "./NumaResources";
import OverallResourcesCard from "./OverallResourcesCard";
import ProjectResourcesCard from "./ProjectResourcesCard";

import Switch from "app/base/components/Switch";
import { useSendAnalytics, useWindowTitle } from "app/base/hooks";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
};

const KVMResources = ({ id }: Props): JSX.Element => {
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

  if (!!pod) {
    const isLxd = pod.type === PodType.LXD;
    const canViewByNuma = pod.resources?.numa.length >= 1;
    // Safeguard in case local storage is set to true even though the pod has no
    // known NUMA nodes.
    const showNumaCards = viewByNuma && canViewByNuma;
    return (
      <>
        {isLxd && (
          <Strip className="u-no-padding--top" shallow>
            <h4 className="u-sv1">Overall</h4>
            <OverallResourcesCard id={pod.id} />
          </Strip>
        )}
        <Strip className={isLxd ? null : "u-no-padding--top"} shallow>
          <div className="u-flex--between u-flex--column-x-small">
            <h4 className="u-sv1" data-test="resources-title">
              {isLxd ? pod.project : ""}
            </h4>
            {canViewByNuma && (
              <Switch
                checked={showNumaCards}
                className="p-switch--inline-label"
                data-test="numa-switch"
                label="View by NUMA node"
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                  const checked = evt.target.checked;
                  setViewByNuma(checked);
                  sendAnalytics(
                    "KVM Resources",
                    "Toggle NUMA view",
                    checked ? "View by NUMA node" : "View aggregate"
                  );
                }}
              />
            )}
          </div>
          {showNumaCards ? (
            <NumaResources id={pod.id} />
          ) : (
            <ProjectResourcesCard id={pod.id} />
          )}
        </Strip>
        <Strip shallow>
          <KVMStorageCards id={pod.id} />
        </Strip>
      </>
    );
  }
  return <Spinner text="Loading" />;
};

export default KVMResources;
