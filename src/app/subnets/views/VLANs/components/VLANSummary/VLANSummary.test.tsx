import { waitFor } from "@testing-library/react";
import configureStore from "redux-mock-store";

import { VLANDetailsSidePanelViews } from "../../views/constants";

import VLANSummary from "./VLANSummary";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import type { Controller } from "@/app/store/controller/types";
import type { Fabric } from "@/app/store/fabric/types";
import type { RootState } from "@/app/store/root/types";
import type { Space } from "@/app/store/space/types";
import type { VLAN } from "@/app/store/vlan/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  userEvent,
  screen,
  within,
  setupMockServer,
  renderWithProviders,
} from "@/testing/utils";

const mockStore = configureStore();
setupMockServer(authResolvers.getCurrentUser.handler());

describe("VLANSummary", () => {
  let controller: Controller;
  let fabric: Fabric;
  let space: Space;
  let state: RootState;
  let vlan: VLAN;
  const setSidePanelContent = vi.fn();

  beforeEach(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });

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
      vlan: factory.vlanState({ items: [vlan] }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correct details", () => {
    const store = mockStore(state);
    renderWithProviders(<VLANSummary id={vlan.id} />, { store });
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

  it("can trigger the edit form side panel", async () => {
    const store = mockStore(state);
    renderWithProviders(<VLANSummary id={vlan.id} />, { store });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    });
    const button = screen.getByRole("button", { name: "Edit" });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: VLANDetailsSidePanelViews.EditVLAN,
    });
  });
});
