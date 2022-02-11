import { generateLegacyURL } from "@maas-ui/maas-ui-shared";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VLANSummary from "./VLANSummary";

import controllersURLs from "app/controllers/urls";
import type { Controller } from "app/store/controller/types";
import type { Fabric } from "app/store/fabric/types";
import type { RootState } from "app/store/root/types";
import type { Space } from "app/store/space/types";
import type { VLAN } from "app/store/vlan/types";
import subnetsURLs from "app/subnets/urls";
import {
  authState as authStateFactory,
  user as userFactory,
  userState as userStateFactory,
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

let controller: Controller;
let fabric: Fabric;
let space: Space;
let state: RootState;
let vlan: VLAN;

beforeEach(() => {
  fabric = fabricFactory({ id: 1, name: "fabric-1" });
  space = spaceFactory({ id: 22, name: "outer" });
  controller = controllerFactory({
    domain: modelRefFactory({ name: "domain" }),
    hostname: "controller-abc",
    system_id: "abc123",
  });
  vlan = vlanFactory({
    description: "I'm a little VLAN",
    fabric: fabric.id,
    mtu: 5432,
    name: "vlan-333",
    primary_rack: controller.system_id,
    space: space.id,
    vid: 1010,
  });
  state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
    fabric: fabricStateFactory({ items: [fabric] }),
    space: spaceStateFactory({ items: [space] }),
    user: userStateFactory({
      auth: authStateFactory({ user: userFactory({ is_superuser: true }) }),
    }),
    vlan: vlanStateFactory({ items: [vlan] }),
  });
});

it("renders correct details", () => {
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
    generateLegacyURL(
      controllersURLs.controller.index({ id: controller.system_id })
    )
  );
});

it("can display the edit form", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <VLANSummary id={vlan.id} />
      </MemoryRouter>
    </Provider>
  );
  const formName = "Edit VLAN";
  const button = screen.getByRole("button", { name: "Edit" });
  expect(button).toBeInTheDocument();
  expect(screen.queryAllByRole("form", { name: formName })).toHaveLength(0);
  userEvent.click(button);
  expect(screen.queryAllByRole("button", { name: "Edit" })).toHaveLength(0);
  expect(screen.getByRole("form", { name: formName })).toBeInTheDocument();
});
