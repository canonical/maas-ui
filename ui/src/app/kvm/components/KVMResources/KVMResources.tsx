import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import KVMStorageCards from "./KVMStorageCards";
import OverallResourcesCard from "./OverallResourcesCard";
import ProjectResourcesCard from "./ProjectResourcesCard";

import { useWindowTitle } from "app/base/hooks";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Pod["id"];
};

const KVMResources = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  useWindowTitle(`KVM resources ${pod?.name || ""}`);

  if (!!pod) {
    const isLxd = pod.type === PodType.LXD;

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
              {isLxd ? pod.power_parameters?.project : ""}
            </h4>
          </div>
          <ProjectResourcesCard id={pod.id} />
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
