import VLANDetailsHeader from "./VLANDetailsHeader";

import type { RootState } from "@/app/store/root/types";
import type { VLAN } from "@/app/store/vlan/types";
import { VlanVid } from "@/app/store/vlan/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

describe("VLANDetailsHeader", () => {
  let state: RootState;
  let vlan: VLAN;

  beforeEach(() => {
    vlan = factory.vlanDetails({ fabric: 2 });
    state = factory.rootState({
      fabric: factory.fabricState({
        items: [factory.fabric({ id: 2, name: "fabric1" })],
      }),
      vlan: factory.vlanState({
        items: [vlan],
      }),
    });
  });

  it("shows the title when the vlan has a name", () => {
    vlan = factory.vlanDetails({ name: "vlan-1", fabric: 2 });
    state.vlan.items = [vlan];
    renderWithBrowserRouter(<VLANDetailsHeader id={vlan.id} />, {
      route: "/vlan/1234",
      state,
    });
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "vlan-1 in fabric1"
    );
  });

  it("shows the title when it is the default for the fabric", () => {
    vlan = factory.vlanDetails({
      fabric: 2,
      name: undefined,
      vid: VlanVid.UNTAGGED,
    });
    state.vlan.items = [vlan];
    state.fabric.items = [
      factory.fabric({ id: 2, name: "fabric1", default_vlan_id: vlan.id }),
    ];
    renderWithBrowserRouter(<VLANDetailsHeader id={vlan.id} />, {
      route: "/vlan/1234",
      state,
    });
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "Default VLAN in fabric1"
    );
  });

  it("shows the title when it is not the default for the fabric", () => {
    vlan = factory.vlanDetails({ fabric: 2, name: undefined, vid: 3 });
    state.vlan.items = [vlan];
    state.fabric.items = [
      factory.fabric({ id: 2, name: "fabric1", default_vlan_id: 99 }),
    ];
    renderWithBrowserRouter(<VLANDetailsHeader id={vlan.id} />, {
      route: "/vlan/1234",
      state,
    });
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "VLAN 3 in fabric1"
    );
  });

  it("shows a spinner subtitle if the vlan is loading details", () => {
    vlan = factory.vlan({ name: "vlan-1" });
    state.vlan.items = [vlan];
    renderWithBrowserRouter(<VLANDetailsHeader id={vlan.id} />, {
      route: "/vlan/1234",
      state,
    });
    expect(
      screen.getByTestId("section-header-subtitle-spinner")
    ).toBeInTheDocument();
  });

  it("does not show a spinner subtitle if the vlan is detailed", () => {
    renderWithBrowserRouter(<VLANDetailsHeader id={vlan.id} />, {
      route: "/vlan/1234",
      state,
    });
    expect(
      screen.queryByTestId("section-header-subtitle-spinner")
    ).not.toBeInTheDocument();
  });

  it("shows the delete button when the user is an admin", () => {
    state.user = factory.userState({
      auth: factory.authState({
        user: factory.user({ is_superuser: true }),
      }),
    });
    renderWithBrowserRouter(<VLANDetailsHeader id={vlan.id} />, {
      route: "/vlan/1234",
      state,
    });
    expect(
      screen.getByRole("button", { name: "Delete VLAN" })
    ).toBeInTheDocument();
  });

  it("does not show the delete button if the user is not an admin", () => {
    state.user = factory.userState({
      auth: factory.authState({
        user: factory.user({ is_superuser: false }),
      }),
    });
    renderWithBrowserRouter(<VLANDetailsHeader id={vlan.id} />, {
      route: "/vlan/1234",
      state,
    });
    expect(
      screen.queryByRole("button", { name: "Delete VLAN" })
    ).not.toBeInTheDocument();
  });
});
