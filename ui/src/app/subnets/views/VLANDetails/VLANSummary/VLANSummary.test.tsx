import { generateLegacyURL } from "@maas-ui/maas-ui-shared";
import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VLANSummary from "./VLANSummary";

import baseURLs from "app/base/urls";
import subnetsURLs from "app/subnets/urls";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  modelRef as modelRefFactory,
  rootState as rootStateFactory,
  space as spaceFactory,
  spaceState as spaceStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("renders correct details", () => {
  const fabric = fabricFactory({ id: 1, name: "fabric-1" });
  const space = spaceFactory({ id: 22, name: "outer" });
  const controller = controllerFactory({
    domain: modelRefFactory({ name: "domain" }),
    hostname: "controller-abc",
    system_id: "abc123",
  });
  const vlan = vlanFactory({
    description: "I'm a little VLAN",
    fabric: fabric.id,
    mtu: 5432,
    name: "vlan-333",
    primary_rack: controller.system_id,
    space: space.id,
    vid: 1010,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
    fabric: fabricStateFactory({ items: [fabric] }),
    space: spaceStateFactory({ items: [space] }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <VLANSummary id={vlan.id} />
      </MemoryRouter>
    </Provider>
  );
  const vlanSummary = screen.getByRole("region", { name: "VLAN summary" });

  expect(
    within(vlanSummary).getByRole("link", { name: space.name })
  ).toHaveAttribute("href", subnetsURLs.space.index({ id: space.id }));
  expect(
    within(vlanSummary).getByRole("link", { name: fabric.name })
  ).toHaveAttribute("href", subnetsURLs.fabric.index({ id: fabric.id }));
  expect(
    within(vlanSummary).getByRole("link", { name: /controller-abc/i })
  ).toHaveAttribute(
    "href",
    generateLegacyURL(baseURLs.controller({ id: controller.system_id }))
  );
});
