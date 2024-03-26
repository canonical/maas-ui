import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VLANSummary from "./VLANSummary";

import urls from "@/app/base/urls";
import type { Controller } from "@/app/store/controller/types";
import type { Fabric } from "@/app/store/fabric/types";
import type { RootState } from "@/app/store/root/types";
import type { Space } from "@/app/store/space/types";
import type { VLAN } from "@/app/store/vlan/types";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, within } from "@/testing/utils";

const mockStore = configureStore();

let controller: Controller;
let fabric: Fabric;
let space: Space;
let state: RootState;
let vlan: VLAN;

beforeEach(() => {
  fabric = factory.fabric({ id: 1, name: "fabric-1" });
  space = factory.space({ id: 22, name: "outer" });
  controller = factory.controller({
    domain: factory.modelRef({ name: "domain" }),
    hostname: "controller-abc",
    system_id: "abc123",
  });
  vlan = factory.vlan({
    description: "I'm a little VLAN",
    fabric: fabric.id,
    mtu: 5432,
    name: "vlan-333",
    primary_rack: controller.system_id,
    space: space.id,
    vid: 1010,
  });
  state = factory.rootState({
    controller: factory.controllerState({ items: [controller] }),
    fabric: factory.fabricState({ items: [fabric] }),
    space: factory.spaceState({ items: [space] }),
    user: factory.userState({
      auth: factory.authState({ user: factory.user({ is_superuser: true }) }),
    }),
    vlan: factory.vlanState({ items: [vlan] }),
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
  ).toHaveAttribute("href", urls.subnets.space.index({ id: space.id }));
  expect(
    within(vlanSummary).getByRole("link", { name: fabric.name })
  ).toHaveAttribute("href", urls.subnets.fabric.index({ id: fabric.id }));
  expect(
    within(vlanSummary).getByRole("link", { name: /controller-abc/i })
  ).toHaveAttribute(
    "href",
    urls.controllers.controller.index({ id: controller.system_id })
  );
});

it("can display the edit form", async () => {
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
  expect(
    screen.queryByRole("form", { name: formName })
  ).not.toBeInTheDocument();
  await userEvent.click(button);
  expect(
    screen.queryByRole("button", { name: "Edit" })
  ).not.toBeInTheDocument();
  expect(screen.getByRole("form", { name: formName })).toBeInTheDocument();
});
