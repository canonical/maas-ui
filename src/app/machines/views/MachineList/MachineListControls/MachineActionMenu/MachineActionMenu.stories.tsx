import type { Meta } from "@storybook/react";

import MachineActionMenu from ".";

const meta: Meta<typeof MachineActionMenu> = {
  title: "Sections/Machine/MachineActionMenu",
  component: MachineActionMenu,
  tags: ["autodocs"],
};
export default meta;

export const Example = {
  args: {
    hasSelection: true,
  },
};
