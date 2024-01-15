import type { Meta } from "@storybook/react";

import { MachineActionForm } from "./MachineActionFormWrapper";

import { ACTION_STATUS } from "@/app/base/constants";
import ErrorDetails from "@/app/machines/components/ErrorDetails";
import { NodeActions } from "@/app/store/types/node";

const meta: Meta<typeof MachineActionForm> = {
  title: "Sections/Machine/MachineActionForm",
  component: MachineActionForm,
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
    filter: {},
  },
};

export const MultipleMachines = {
  args: {
    selectedCount: 2,
    selectedMachines: { items: ["abc123", "def456"] },
    action: NodeActions.ABORT,
    filter: {},
  },
};

export const SingleMachineError = {
  args: {
    selectedCount: 1,
    selectedMachines: { items: ["abc123"] },
    action: NodeActions.ABORT,
    actionStatus: ACTION_STATUS.error,
    actionErrors: "There was an error.",
    filter: {},
  },
};

export const MultipleMachinesError = {
  args: {
    selectedCount: 2,
    selectedMachines: { items: ["abc123", "def456"] },
    action: NodeActions.ABORT,
    actionStatus: ACTION_STATUS.error,
    actionErrors: (
      <ErrorDetails
        failedSystemIds={["abc123", "def456"]}
        failureDetails={{
          "There was an error": ["abc123"],
          "There was another error": ["def456"],
        }}
      />
    ),
    filter: {},
  },
};
