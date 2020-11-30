import { Icon } from "@canonical/react-components";

import type { Disk } from "app/store/machine/types";

type Props = { disk: Disk };

const BootStatus = ({ disk }: Props): JSX.Element => {
  if (disk.type === "physical") {
    return disk.is_boot ? <Icon name="tick" /> : <Icon name="close" />;
  }
  return <span>—</span>;
};

export default BootStatus;
