import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VLANDetailsHeader from "./VLANDetailsHeader";

import type { RootState } from "app/store/root/types";
import type { VLAN } from "app/store/vlan/types";
import { VlanVid } from "app/store/vlan/types";
import {
  authState as authStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userState as userStateFactory,
  vlan as vlanFactory,
  vlanDetails as vlanDetailsFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VLANDetailsHeader", () => {
  let state: RootState;
  let vlan: VLAN;

  beforeEach(() => {
    vlan = vlanDetailsFactory({ fabric: 2 });
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [fabricFactory({ id: 2, name: "fabric1" })],
      }),
      vlan: vlanStateFactory({
        items: [vlan],
      }),
    });
  });

  it("shows the title when the vlan has a name", () => {
    vlan = vlanDetailsFactory({ name: "vlan-1", fabric: 2 });
    state.vlan.items = [vlan];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/vlan/1234" }]}>
          <VLANDetailsHeader id={vlan.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "vlan-1 in fabric1"
    );
  });

  it("shows the title when it is the default for the fabric", () => {
    vlan = vlanDetailsFactory({
      fabric: 2,
      name: undefined,
      vid: VlanVid.UNTAGGED,
    });
    state.vlan.items = [vlan];
    state.fabric.items = [
      fabricFactory({ id: 2, name: "fabric1", default_vlan_id: vlan.id }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/vlan/1234" }]}>
          <VLANDetailsHeader id={vlan.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "Default VLAN in fabric1"
    );
  });

  it("shows the title when it is not the default for the fabric", () => {
    vlan = vlanDetailsFactory({ fabric: 2, name: undefined, vid: 3 });
    state.vlan.items = [vlan];
    state.fabric.items = [
      fabricFactory({ id: 2, name: "fabric1", default_vlan_id: 99 }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/vlan/1234" }]}>
          <VLANDetailsHeader id={vlan.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "VLAN 3 in fabric1"
    );
  });

  it("shows a spinner subtitle if the vlan is loading details", () => {
    vlan = vlanFactory({ name: "vlan-1" });
    state.vlan.items = [vlan];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/vlan/1234" }]}>
          <VLANDetailsHeader id={vlan.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.queryByTestId("section-header-subtitle-spinner")
    ).toBeInTheDocument();
  });

  it("does not show a spinner subtitle if the vlan is detailed", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/vlan/1234" }]}>
          <VLANDetailsHeader id={vlan.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByTestId("section-header-subtitle-spinner")).toBeNull();
  });

  it("shows the delete button when the user is an admin", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ is_superuser: true }),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/vlan/1234" }]}>
          <VLANDetailsHeader id={vlan.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByTestId("delete-vlan")).toBeInTheDocument();
  });

  it("does not show the delete button if the user is not an admin", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ is_superuser: false }),
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/vlan/1234" }]}>
          <VLANDetailsHeader id={vlan.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByTestId("delete-vlan")).toBeNull();
  });
});
