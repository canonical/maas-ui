import type { Meta } from "@storybook/react";

import GroupColumn from "./GroupColumn";

const meta: Meta<typeof GroupColumn> = {
  title: "Components/GroupColumn",
  component: GroupColumn,
  tags: ["autodocs"],
};

export default meta;

export const Example = {
  args: {
    itemName: "network",
    groupName: "fabric",
    count: 2,
  },
};
