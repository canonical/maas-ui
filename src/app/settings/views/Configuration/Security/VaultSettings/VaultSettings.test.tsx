import { screen } from "@testing-library/react";

import VaultSettings from "./VaultSettings";

import {
  config as configFactory,
  configState as configStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
  // vaultState as vaultStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

it("displays a spinner while loading config", () => {
  const state = rootStateFactory({
    config: configStateFactory({
      loading: true,
    }),
  });

  renderWithMockStore(<VaultSettings />, { state });

  expect(screen.getByText("Loading...")).toBeInTheDocument();
});
