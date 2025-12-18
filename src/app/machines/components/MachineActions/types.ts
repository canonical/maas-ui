import type { ReactElement } from "react";

import type { Machine } from "@/app/store/machine/types";
import type { NodeActions } from "@/app/store/types/node";

export type MachineActionGroup = {
  items: {
    action: NodeActions;
    label: string;
    onClick: (_?: unknown) => unknown;
  }[];
  icon?: string;
  name: string;
  title: string;
  render?: () => ReactElement;
};

export type MachineActionsProps = {
  disabledActions?: NodeActions[];
  isMachineLocked?: boolean;
  isViewingDetails?: boolean;
  systemId?: Machine["system_id"];
};
