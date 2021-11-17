import { Icon, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import {
  getInterfaceNumaNodes,
  getInterfaceTypeText,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";

type Props = {
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  systemId: Machine["system_id"];
};

const TypeColumn = ({ link, nic, systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  if (!machine) {
    return null;
  }
  const numaNodes = getInterfaceNumaNodes(machine, nic, link);
  const interfaceTypeDisplay = getInterfaceTypeText(machine, nic, link, true);

  return (
    <DoubleRow
      data-testid="type"
      icon={
        numaNodes && numaNodes.length > 1 ? (
          <Tooltip
            position="top-left"
            message="This bond is spread over multiple NUMA nodes. This may lead to suboptimal performance."
          >
            <Icon name="warning" />
          </Tooltip>
        ) : null
      }
      iconSpace={true}
      primary={interfaceTypeDisplay}
      secondary={numaNodes ? numaNodes.join(", ") : null}
    />
  );
};

export default TypeColumn;
