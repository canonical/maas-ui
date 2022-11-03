import { screen } from "@testing-library/react";
import configureStore from "redux-mock-store";

import DeviceHeaderForms from "./DeviceHeaderForms";

import { DeviceHeaderViews } from "app/devices/constants";
import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceHeaderForms", () => {
  it("can render the Add Device form", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 0, name: "maas" })],
        loaded: true,
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 0, name: "subnet" })],
        loaded: true,
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
        items: [zoneFactory({ id: 0, name: "default" })],
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceHeaderForms
        devices={[]}
        headerContent={{ view: DeviceHeaderViews.ADD_DEVICE }}
        setHeaderContent={jest.fn()}
      />,
      { store }
    );

    expect(
      screen.getByRole("form", { name: "Add device" })
    ).toBeInTheDocument();
  });
});
