import DeviceHeaderForms from "./DeviceHeaderForms";

import { DeviceSidePanelViews } from "@/app/devices/constants";
import * as factory from "@/testing/factories";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  screen,
  renderWithBrowserRouter,
  waitFor,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(zoneResolvers.listZones.handler());

describe("DeviceHeaderForms", () => {
  it("can render the Add Device form", async () => {
    const state = factory.rootState({
      domain: factory.domainState({
        items: [factory.domain({ id: 0, name: "maas" })],
        loaded: true,
      }),
      subnet: factory.subnetState({
        items: [factory.subnet({ id: 0, name: "subnet" })],
        loaded: true,
      }),
    });
    renderWithBrowserRouter(
      <DeviceHeaderForms
        devices={[]}
        setSidePanelContent={vi.fn()}
        sidePanelContent={{ view: DeviceSidePanelViews.ADD_DEVICE }}
      />,
      { state }
    );
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());

    expect(
      screen.getByRole("form", { name: "Add device" })
    ).toBeInTheDocument();
  });
});
