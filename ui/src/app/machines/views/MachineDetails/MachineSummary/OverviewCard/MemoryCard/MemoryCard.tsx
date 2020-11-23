import React from "react";

import type { SetSelectedAction } from "../../MachineSummary";
import TestResults from "../../TestResults";

import { HardwareType } from "app/base/enum";

import type { MachineDetails } from "app/store/machine/types";

type Props = {
  machine: MachineDetails;
  setSelectedAction: SetSelectedAction;
};

const MemoryCard = ({ machine, setSelectedAction }: Props): JSX.Element => (
  <>
    <div className="overview-card__memory">
      <strong className="p-muted-heading">Memory</strong>
      <h4>{machine.memory ? machine.memory + " GiB" : "Unknown"}</h4>
    </div>

    <TestResults
      machine={machine}
      hardwareType={HardwareType.Memory}
      setSelectedAction={setSelectedAction}
    />
  </>
);

export default MemoryCard;
