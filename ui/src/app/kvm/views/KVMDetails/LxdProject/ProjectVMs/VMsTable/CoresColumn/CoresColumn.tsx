import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import type { Machine } from "app/store/machine/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { getRanges } from "app/utils";

type Props = {
  machineId: Machine["system_id"];
  podId: Pod["id"];
};

const CoresColumn = ({ machineId, podId }: Props): JSX.Element => {
  const vmResource = useSelector((state: RootState) =>
    podSelectors.getVmResource(state, podId, machineId)
  );

  if (!vmResource) {
    return <Spinner />;
  }

  const pinnedRanges = getRanges(vmResource.pinned_cores).join(", ");
  const primaryText = pinnedRanges || `Any ${vmResource.unpinned_cores}`;
  const secondaryText = pinnedRanges && "pinned";
  return (
    <DoubleRow
      primary={primaryText}
      primaryClassName="u-align--right"
      primaryTitle={primaryText}
      secondary={secondaryText}
      secondaryClassName="u-align--right"
      secondaryTitle={secondaryText}
    />
  );
};

export default CoresColumn;
