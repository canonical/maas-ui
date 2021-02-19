import { Icon } from "@canonical/react-components";
import { useSelector } from "react-redux";

import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import { isBootInterface } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  systemId: Machine["system_id"];
};

const PXEColumn = ({ link, nic, systemId }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  if (!machine) {
    return null;
  }
  const isBoot = isBootInterface(machine, nic, link);

  return isBoot ? (
    <span className="u-align--center">
      <Icon name="success" />
    </span>
  ) : null;
};

export default PXEColumn;
