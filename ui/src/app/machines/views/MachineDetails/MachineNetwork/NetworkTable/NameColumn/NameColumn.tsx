import { useSelector } from "react-redux";

import type { Selected } from "../types";

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
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";

type Props = {
  checkboxSpace?: boolean;
  checkSelected?: CheckboxHandlers<Selected>["checkSelected"] | null;
  handleRowCheckbox?: CheckboxHandlers<Selected>["handleRowCheckbox"] | null;
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  selected?: Selected[] | null;
  showCheckbox?: boolean;
  systemId: Machine["system_id"];
};

const NameColumn = ({
  checkboxSpace,
  checkSelected,
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
            checkSelected={checkSelected}
            disabled={isAllNetworkingDisabled}
            handleRowCheckbox={handleRowCheckbox}
            item={{
              linkId: link?.id,
              nicId: nic.id,
            }}
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
