import configureStore from "redux-mock-store";

import DeviceHeaderForms from "./DeviceHeaderForms";

import { DeviceSidePanelViews } from "@/app/devices/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceHeaderForms", () => {
  it("can render the Add Device form", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        items: [factory.domain({ id: 0, name: "maas" })],
        loaded: true,
      }),
      subnet: factory.subnetState({
        items: [factory.subnet({ id: 0, name: "subnet" })],
        loaded: true,
      }),
      zone: factory.zoneState({
        genericActions: factory.zoneGenericActions({ fetch: "success" }),
        items: [factory.zone({ id: 0, name: "default" })],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceHeaderForms
        devices={[]}
        setSidePanelContent={vi.fn()}
        sidePanelContent={{ view: DeviceSidePanelViews.ADD_DEVICE }}
      />,
      { store }
    );

    expect(
      screen.getByRole("form", { name: "Add device" })
    ).toBeInTheDocument();
  });
});
