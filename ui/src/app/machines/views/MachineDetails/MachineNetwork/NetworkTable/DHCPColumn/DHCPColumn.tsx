import { Icon, Spinner, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import fabricSelectors from "app/store/fabric/selectors";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, NetworkInterface } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import vlanSelectors from "app/store/vlan/selectors";
import { getDHCPStatus } from "app/store/vlan/utils";

type Props = {
  nic?: NetworkInterface | null;
  systemId: Machine["system_id"];
};

const DHCPColumn = ({ nic, systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const fabricsLoaded = useSelector(fabricSelectors.loaded);
  const fabrics = useSelector(fabricSelectors.all);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, nic?.vlan_id)
  );
  const vlans = useSelector(vlanSelectors.all);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  if (!machine) {
    return null;
  }
  if (!fabricsLoaded || !vlansLoaded) {
    return <Spinner />;
  }

  return (
    <DoubleRow
      data-test="dhcp"
      icon={
        vlan && vlan.relay_vlan ? (
          <Tooltip
            position="btm-right"
            message={getDHCPStatus(vlan, vlans, fabrics, true)}
          >
            <Icon name="information" />
          </Tooltip>
        ) : null
      }
      iconSpace={true}
      primary={getDHCPStatus(vlan, vlans, fabrics)}
    />
  );
};

export default DHCPColumn;
