import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Labels as ReservedRangeFormLabels } from "../ReservedRangeForm/ReservedRangeForm";

import ReservedRanges, { Labels } from "./ReservedRanges";

import { actions as ipRangeActions } from "app/store/iprange";
import type { IPRange } from "app/store/iprange/types";
import { IPRangeType } from "app/store/iprange/types";
import type { RootState } from "app/store/root/types";
import type { Subnet } from "app/store/subnet/types";
import type { VLAN } from "app/store/vlan/types";
import {
  rootState as rootStateFactory,
  ipRange as ipRangeFactory,
  ipRangeState as ipRangeStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let ipRange: IPRange;
let state: RootState;
let subnet: Subnet;
let vlan: VLAN;

beforeEach(() => {
  subnet = subnetFactory();
  vlan = vlanFactory();
  ipRange = ipRangeFactory({
    comment: "what a beaut",
    start_ip: "11.1.1.1",
    subnet: subnet.id,
    type: IPRangeType.Reserved,
    user: "wombat",
  });
  state = rootStateFactory({
    iprange: ipRangeStateFactory({
      items: [ipRange],
    }),
    subnet: subnetStateFactory({
      items: [subnet],
    }),
    vlan: vlanStateFactory({
      items: [vlan],
    }),
  });
});

it("renders for a subnet", () => {
  const subnet2 = subnetFactory();
  state.iprange.items = [
    ipRangeFactory({ start_ip: "11.1.1.1", subnet: subnet.id }),
    ipRangeFactory({ start_ip: "11.1.1.2", subnet: subnet.id }),
    ipRangeFactory({ start_ip: "11.1.1.3", subnet: subnet2.id }),
  ];
  state.subnet.items = [subnet, subnet2];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.queryAllByRole("gridcell", {
      name: Labels.StartIP,
    })
  ).toHaveLength(2);
  expect(
    screen
      .getAllByRole("gridcell", {
        name: Labels.StartIP,
      })
      .find((td) => td.textContent === "11.1.1.1")
  ).toBeInTheDocument();
  expect(
    screen
      .getAllByRole("gridcell", {
        name: Labels.StartIP,
      })
      .find((td) => td.textContent === "11.1.1.2")
  ).toBeInTheDocument();
});

it("renders for a vlan", () => {
  const vlan2 = vlanFactory();
  state.iprange.items = [
    ipRangeFactory({ start_ip: "11.1.1.1", vlan: vlan.id }),
    ipRangeFactory({ start_ip: "11.1.1.2", vlan: vlan.id }),
    ipRangeFactory({ start_ip: "11.1.1.3", vlan: vlan2.id }),
  ];
  state.vlan.items = [vlan, vlan2];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges vlanId={vlan.id} hasVLANSubnets />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.queryAllByRole("gridcell", {
      name: Labels.StartIP,
    })
  ).toHaveLength(2);
  expect(
    screen
      .getAllByRole("gridcell", {
        name: Labels.StartIP,
      })
      .find((td) => td.textContent === "11.1.1.1")
  ).toBeInTheDocument();
  expect(
    screen
      .getAllByRole("gridcell", {
        name: Labels.StartIP,
      })
      .find((td) => td.textContent === "11.1.1.2")
  ).toBeInTheDocument();
});

it("displays an empty message for a subnet", () => {
  state.iprange.items = [];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText("No IP ranges have been reserved for this subnet.")
  ).toBeInTheDocument();
});

it("displays an empty message for a vlan", () => {
  state.iprange.items = [];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges vlanId={vlan.id} hasVLANSubnets />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText("No IP ranges have been reserved for this VLAN.")
  ).toBeInTheDocument();
});

it("displays a message if there are no subnets in a VLAN", () => {
  state.subnet.items = [];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges vlanId={vlan.id} hasVLANSubnets={false} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText(/No subnets are available on this VLAN/)
  ).toBeInTheDocument();
});

it("displays content when it is dynamic", () => {
  ipRange.type = IPRangeType.Dynamic;
  state.iprange.items = [ipRange];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("gridcell", {
      name: Labels.Type,
    })
  ).toHaveTextContent("Dynamic");
  expect(
    screen.getByRole("gridcell", {
      name: Labels.Owner,
    })
  ).toHaveTextContent("MAAS");
  expect(
    screen.getByRole("gridcell", {
      name: Labels.Comment,
    })
  ).toHaveTextContent("Dynamic");
});

it("displays content when it is reserved", () => {
  ipRange.type = IPRangeType.Reserved;
  state.iprange.items = [ipRange];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("gridcell", {
      name: Labels.Type,
    })
  ).toHaveTextContent("Reserved");
  expect(
    screen.getByRole("gridcell", {
      name: Labels.Owner,
    })
  ).toHaveTextContent("wombat");
  expect(
    screen.getByRole("gridcell", {
      name: Labels.Comment,
    })
  ).toHaveTextContent("what a beaut");
});

it("displays an edit form", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.click(screen.getByRole("button", { name: "Edit" }));

  await waitFor(() =>
    expect(
      screen.getByRole("form", { name: ReservedRangeFormLabels.EditRange })
    ).toBeInTheDocument()
  );
});

it("displays confirm delete message", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.click(screen.getByRole("button", { name: "Delete" }));

  await waitFor(() => {
    expect(
      screen.getByText(
        new RegExp("Are you sure you want to remove this IP range?")
      )
    ).toBeInTheDocument();
  });
});

it("dispatches an action to delete a reserved range", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.click(screen.getByTestId("table-actions-delete"));
  await userEvent.click(screen.getByTestId("action-confirm"));

  const expectedAction = ipRangeActions.delete(ipRange.id);

  await waitFor(() => {
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });
});

it("displays an add button when it is reserved", () => {
  ipRange.type = IPRangeType.Reserved;
  state.iprange.items = [ipRange];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("button", {
      name: Labels.ReserveRange,
    })
  ).toBeInTheDocument();
});

it("displays an add button when it is dynamic", async () => {
  ipRange.type = IPRangeType.Dynamic;
  state.iprange.items = [ipRange];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.click(
    screen.queryAllByRole("button", {
      name: Labels.ReserveRange,
    })[0]
  );
  await userEvent.click(screen.getByTestId("reserve-dynamic-range-menu-item"));

  await waitFor(() => {
    expect(
      screen.getByRole("button", {
        name: Labels.ReserveDynamicRange,
      })
    ).toBeInTheDocument();
  });
});

it("disables the add button if there are no subnets in a VLAN", () => {
  ipRange.type = IPRangeType.Reserved;
  state.iprange.items = [ipRange];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges vlanId={vlan.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("button", { name: Labels.ReserveRange })
  ).toHaveAttribute("disabled");
});

it("can display an add form", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.click(
    screen.queryAllByRole("button", {
      name: Labels.ReserveRange,
    })[0]
  );
  await userEvent.click(screen.getByTestId("reserve-range-menu-item"));

  await waitFor(() => {
    expect(
      screen.getByRole("form", {
        name: ReservedRangeFormLabels.CreateRange,
      })
    ).toBeInTheDocument();
  });
});

it("displays the subnet column when the table is for a VLAN", () => {
  state.iprange.items = [
    ipRangeFactory({ start_ip: "11.1.1.1", vlan: vlan.id }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges hasVLANSubnets vlanId={vlan.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("gridcell", {
      name: Labels.Subnet,
    })
  ).toBeInTheDocument();
});

it("does not display the subnet column when the table is for a subnet", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <ReservedRanges subnetId={subnet.id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.queryByRole("gridcell", {
      name: Labels.Subnet,
    })
  ).not.toBeInTheDocument();
});
