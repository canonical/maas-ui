import { RootProviders } from "../src/index";
import React, { StrictMode } from "react";

import type { Preview } from "@storybook/react";

import "../src/scss/index.scss";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <RootProviders>
        <Story />
      </RootProviders>
    ),
  ],
};

export default preview;
