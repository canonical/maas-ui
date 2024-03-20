import { VLANsColumn } from "./VLANsColumn";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("VLANsColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      controller: factory.controllerState({
        loaded: true,
        items: [
          factory.controller({
            system_id: "abc123",
            vlans_ha: factory.controllerVlansHA({
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
