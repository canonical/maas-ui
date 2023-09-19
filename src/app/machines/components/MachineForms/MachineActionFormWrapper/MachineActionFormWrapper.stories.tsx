import type { Meta } from "@storybook/react";

import MachineActionFormWrapper from "./MachineActionFormWrapper";

import { NodeActions } from "app/store/types/node";

const meta: Meta<typeof MachineActionFormWrapper> = {
  title: "Sections/Machine/MachineActionFormWrapper",
  component: MachineActionFormWrapper,
  tags: ["autodocs"],
  argTypes: {
    action: {
      options: Object.keys(NodeActions),
      mapping: NodeActions,
      control: {
        type: "radio",
      },
    },
  },
};
export default meta;

export const SingleMachine = {
  args: {
    selectedCount: 1,
    selectedMachines: { items: ["abc123"] },
    action: NodeActions.ABORT,
  },
};

export const MultipleMachines = {
  args: {
    selectedCount: 2,
    selectedMachines: { items: ["abc123", "def456"] },
    action: NodeActions.ABORT,
  },
};
