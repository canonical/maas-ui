import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import EditVLAN from "./EditVLAN";

import type { RootState } from "app/store/root/types";
import { actions as vlanActions } from "app/store/vlan";
import type { VLAN } from "app/store/vlan/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  space as spaceFactory,
  spaceState as spaceStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("EditVLAN", () => {
  let state: RootState;
  let vlan: VLAN;

  beforeEach(() => {
    const fabric = fabricFactory({ id: 22, name: "fabric1" });
    const space = spaceFactory({ id: 23, name: "space1" });
    vlan = vlanFactory({
      description: "I'm a little VLAN",
      fabric: 22,
      mtu: 5432,
      name: "vlan-333",
      space: space.id,
      vid: 1010,
    });
    state = rootStateFactory({
      fabric: fabricStateFactory({ items: [fabric, fabricFactory()] }),
      space: spaceStateFactory({ items: [space, spaceFactory()] }),
      vlan: vlanStateFactory({ items: [vlan] }),
    });
  });

  it("displays a spinner when data is loading", () => {
    state.vlan.items = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <EditVLAN close={jest.fn()} id={vlan.id} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("Spinner")).toBeInTheDocument();
  });

  it("initialises the vlan details", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <EditVLAN close={jest.fn()} id={vlan.id} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("textbox", { name: "VID" })).toHaveAttribute(
      "value",
      vlan.vid.toString()
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "value",
      vlan.name
    );
    expect(screen.getByRole("textbox", { name: "MTU" })).toHaveAttribute(
      "value",
      vlan.mtu.toString()
    );
    expect(
      screen.getByRole("textbox", { name: "Description" }).textContent
    ).toBe(vlan.description);
    expect(
      within(screen.getByRole("combobox", { name: "Space" })).getByRole(
        "option",
        { name: "space1", selected: true }
      )
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("combobox", { name: "Fabric" })).getByRole(
        "option",
        { name: "fabric1", selected: true }
      )
    ).toBeInTheDocument();
  });

  it("dispatches an action to update a VLAN", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <EditVLAN close={jest.fn()} id={vlan.id} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    fireEvent.submit(screen.getByRole("form"));
    const expected = vlanActions.update({
      description: vlan.description,
      fabric: vlan.fabric,
      id: vlan.id,
      mtu: vlan.mtu,
      name: vlan.name,
      space: vlan.space,
      vid: vlan.vid,
    });
    await waitFor(() =>
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected)
    );
  });

  it("allows the space to be unset", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <EditVLAN close={jest.fn()} id={vlan.id} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByRole("combobox", { name: "Space" }), {
      target: { value: null },
    });
    await waitFor(() =>
      expect(
        within(screen.getByRole("combobox", { name: "Space" })).getByRole(
          "option",
          { name: "No space", selected: true }
        )
      ).toBeInTheDocument()
    );
  });
});
