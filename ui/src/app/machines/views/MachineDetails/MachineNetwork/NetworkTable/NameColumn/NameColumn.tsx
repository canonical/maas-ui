import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import RowCheckbox from "app/base/components/RowCheckbox";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import {
  getInterfaceName,
  getLinkInterface,
  useIsAllNetworkingDisabled,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  checkboxSpace?: boolean;
  handleRowCheckbox?: (
    item: NetworkInterface["id"],
    rows: NetworkInterface["id"][]
  ) => void | null;
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  selected?: NetworkInterface["id"][] | null;
  showCheckbox?: boolean;
  systemId: Machine["system_id"];
};

const NameColumn = ({
  checkboxSpace,
  handleRowCheckbox,
  link,
  nic,
  selected,
  showCheckbox,
  systemId,
}: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  if (!machine) {
    return null;
  }
  if (link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  if (!nic) {
    return null;
  }
  const name = getInterfaceName(machine, nic, link);

  return (
    <DoubleRow
      primary={
        showCheckbox && handleRowCheckbox && selected ? (
          <RowCheckbox
            disabled={isAllNetworkingDisabled}
            handleRowCheckbox={handleRowCheckbox}
            item={nic.id}
            items={selected}
            inputLabel={<span data-test="name">{name}</span>}
          />
        ) : (
          <span data-test="name">{name}</span>
        )
      }
      secondary={nic.mac_address}
      primaryClassName={checkboxSpace ? "u-nudge--primary-row" : null}
      secondaryClassName={checkboxSpace ? "u-nudge--secondary-row" : null}
    />
  );
};

export default NameColumn;
