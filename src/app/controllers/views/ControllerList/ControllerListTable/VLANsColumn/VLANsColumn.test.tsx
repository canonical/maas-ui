import { screen } from "@testing-library/react";

import { VLANsColumn } from "./VLANsColumn";

import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  controllerVlansHA as controllerVlansHAFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("VLANsColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [
          controllerFactory({
            system_id: "abc123",
            vlans_ha: controllerVlansHAFactory({
              true: 2,
              false: 1,
            }),
          }),
        ],
      }),
    });
  });

  it("displays total number of vlans", () => {
    renderWithBrowserRouter(<VLANsColumn systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByTestId("vlan-count")).toHaveTextContent("3");
  });

  it("displays ha details", () => {
    renderWithBrowserRouter(<VLANsColumn systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByTestId("ha-vlans")).toHaveTextContent(
      "Non-HA(1), HA(2)"
    );
  });
});
