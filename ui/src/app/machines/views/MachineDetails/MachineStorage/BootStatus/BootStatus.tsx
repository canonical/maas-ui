import { Icon } from "@canonical/react-components";
import React from "react";

import type { NormalisedStorageDevice } from "../types";

type Props = { storageDevice: NormalisedStorageDevice };

const BootCell = ({ storageDevice }: Props): JSX.Element => {
  if (storageDevice.type === "physical") {
    return storageDevice.boot ? <Icon name="tick" /> : <Icon name="close" />;
  }
  return <span>—</span>;
};

export default BootCell;
