import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ReservedRanges, { Labels } from "./ReservedRanges";

import { actions as ipRangeActions } from "app/store/iprange";
import { IPRangeType } from "app/store/iprange/types";
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

it("renders for a subnet", () => {
  const subnet = subnetFactory();
  const subnet2 = subnetFactory();
  const state = rootStateFactory({
    iprange: ipRangeStateFactory({
      items: [
        ipRangeFactory({ start_ip: "11.1.1.1", subnet: subnet.id }),
        ipRangeFactory({ start_ip: "11.1.1.2", subnet: subnet.id }),
        ipRangeFactory({ start_ip: "11.1.1.3", subnet: subnet2.id }),
      ],
    }),
    subnet: subnetStateFactory({
      items: [subnet, subnet2],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <ReservedRanges subnetId={subnet.id} />
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
      .queryAllByRole("gridcell", {
        name: Labels.StartIP,
      })
      .find((td) => td.textContent === "11.1.1.1")
  ).toBeInTheDocument();
  expect(
    screen
      .queryAllByRole("gridcell", {
        name: Labels.StartIP,
      })
      .find((td) => td.textContent === "11.1.1.2")
  ).toBeInTheDocument();
});

it("renders for a vlan", () => {
  const vlan = vlanFactory();
  const vlan2 = vlanFactory();
  const state = rootStateFactory({
    iprange: ipRangeStateFactory({
      items: [
        ipRangeFactory({ start_ip: "11.1.1.1", vlan: vlan.id }),
        ipRangeFactory({ start_ip: "11.1.1.2", vlan: vlan.id }),
        ipRangeFactory({ start_ip: "11.1.1.3", vlan: vlan2.id }),
      ],
    }),
    vlan: vlanStateFactory({
      items: [vlan, vlan2],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <ReservedRanges vlanId={vlan.id} />
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
      .queryAllByRole("gridcell", {
        name: Labels.StartIP,
      })
      .find((td) => td.textContent === "11.1.1.1")
  ).toBeInTheDocument();
  expect(
    screen
      .queryAllByRole("gridcell", {
        name: Labels.StartIP,
      })
      .find((td) => td.textContent === "11.1.1.2")
  ).toBeInTheDocument();
});

it("displays an empty message for a subnet", () => {
  const subnet = subnetFactory();
  const state = rootStateFactory({
    subnet: subnetStateFactory({
      items: [subnet],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <ReservedRanges subnetId={subnet.id} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText("No IP ranges have been reserved for this subnet.")
  ).toBeInTheDocument();
});

it("displays an empty message for a vlan", () => {
  const vlan = vlanFactory();
  const state = rootStateFactory({
    vlan: vlanStateFactory({
      items: [vlan],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <ReservedRanges vlanId={vlan.id} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText("No IP ranges have been reserved for this VLAN.")
  ).toBeInTheDocument();
});

it("displays content when it is dynamic", () => {
  const subnet = subnetFactory();
  const state = rootStateFactory({
    iprange: ipRangeStateFactory({
      items: [
        ipRangeFactory({
          start_ip: "11.1.1.1",
          subnet: subnet.id,
          type: IPRangeType.Dynamic,
        }),
      ],
    }),
    subnet: subnetStateFactory({
      items: [subnet],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <ReservedRanges subnetId={subnet.id} />
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
  const subnet = subnetFactory();
  const state = rootStateFactory({
    iprange: ipRangeStateFactory({
      items: [
        ipRangeFactory({
          comment: "what a beaut",
          start_ip: "11.1.1.1",
          subnet: subnet.id,
          type: IPRangeType.Reserved,
          user: "wombat",
        }),
      ],
    }),
    subnet: subnetStateFactory({
      items: [subnet],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <ReservedRanges subnetId={subnet.id} />
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

it("displays confirm delete message", async () => {
  const vlan = vlanFactory();
  const state = rootStateFactory({
    iprange: ipRangeStateFactory({
      items: [ipRangeFactory({ start_ip: "11.1.1.1", vlan: vlan.id })],
    }),
    vlan: vlanStateFactory({
      items: [vlan],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <ReservedRanges vlanId={vlan.id} />
      </MemoryRouter>
    </Provider>
  );
  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
  });
  expect(
    screen.getByText(
      new RegExp("Are you sure you want to remove this IP range?")
    )
  ).toBeInTheDocument();
});

it("dispatches an action to delete a reserved range", async () => {
  const vlan = vlanFactory();
  const ipRange = ipRangeFactory({ start_ip: "11.1.1.1", vlan: vlan.id });
  const state = rootStateFactory({
    iprange: ipRangeStateFactory({
      items: [ipRange],
    }),
    vlan: vlanStateFactory({
      items: [vlan],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <ReservedRanges vlanId={vlan.id} />
      </MemoryRouter>
    </Provider>
  );
  await waitFor(() => {
    fireEvent.click(screen.getByTestId("table-actions-delete"));
    fireEvent.click(screen.getByTestId("action-confirm"));
  });
  const expectedAction = ipRangeActions.delete(ipRange.id);
  const actualAction = store
    .getActions()
    .find((action) => action.type === expectedAction.type);
  expect(actualAction).toStrictEqual(expectedAction);
});
