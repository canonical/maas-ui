import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import type { Machine } from "app/store/machine/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  machineId: Machine["system_id"];
  podId: Pod["id"];
};

const HugepagesColumn = ({ machineId, podId }: Props): JSX.Element => {
  const vmResource = useSelector((state: RootState) =>
    podSelectors.getVmResource(state, podId, machineId)
  );

  if (!vmResource) {
    return <Spinner />;
  }

  return <span>{vmResource.hugepages_backed ? "Enabled" : ""}</span>;
};

export default HugepagesColumn;
