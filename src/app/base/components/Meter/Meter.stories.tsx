import type { Meta } from "@storybook/react";

import Meter, { color } from ".";

const meta: Meta<typeof Meter> = {
  title: "Components/Meter",
  component: Meter,
  tags: ["autodocs"],
};
export default meta;

export const Example = {
  args: {
    data: [
      { value: 20, color: color.link },
      { value: 30, color: color.linkFaded },
      { value: 50, color: "black" },
    ],
  },
};
