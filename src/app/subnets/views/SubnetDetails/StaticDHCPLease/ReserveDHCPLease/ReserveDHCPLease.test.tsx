import configureStore from "redux-mock-store";

import ReserveDHCPLease from "./ReserveDHCPLease";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  getTestState,
  renderWithBrowserRouter,
  userEvent,
  screen,
} from "@/testing/utils";

const { getComputedStyle } = window;
let state: RootState;

const mockStore = configureStore();

beforeAll(() => {
  // getComputedStyle is not implemeneted in jsdom, so we need to do this.
  window.getComputedStyle = (elt) => getComputedStyle(elt);
});

beforeEach(() => {
  state = getTestState();
  state.subnet = factory.subnetState({
    loading: false,
    loaded: true,
    items: [factory.subnet({ id: 1, cidr: "10.0.0.0/24" })],
  });
});

afterAll(() => {
  // Reset to original implementation
  window.getComputedStyle = getComputedStyle;
});

it("displays an error if an invalid IP address is entered", async () => {
  renderWithBrowserRouter(
    <ReserveDHCPLease
      setSidePanelContent={vi.fn()}
      subnetId={state.subnet.items[0].id}
    />,
    { state }
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "IP address" }),
    "420"
  );
  await userEvent.tab();

  expect(
    screen.getByText("This is not a valid IP address")
  ).toBeInTheDocument();
});

it("displays an error if an out-of-range IP address is entered", async () => {
  state.subnet.items = [factory.subnet({ id: 1, cidr: "10.0.0.0/25" })];
  renderWithBrowserRouter(
    <ReserveDHCPLease
      setSidePanelContent={vi.fn()}
      subnetId={state.subnet.items[0].id}
    />,
    { state }
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "IP address" }),
    "129"
  );
  await userEvent.tab();

  expect(
    screen.getByText("The IP address is outside of the subnet's range.")
  ).toBeInTheDocument();
});

it("closes the side panel when the cancel button is clicked", async () => {
  const setSidePanelContent = vi.fn();
  renderWithBrowserRouter(
    <ReserveDHCPLease
      setSidePanelContent={setSidePanelContent}
      subnetId={state.subnet.items[0].id}
    />,
    { state }
  );

  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(setSidePanelContent).toHaveBeenCalledWith(null);
});

it("dispatches an action to create a reserved IP", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <ReserveDHCPLease
      setSidePanelContent={vi.fn()}
      subnetId={state.subnet.items[0].id}
    />,
    { store }
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "IP address" }),
    "69"
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "MAC address" }),
    "FF:FF:FF:FF:FF:FF"
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "Comment" }),
    "bla bla bla"
  );

  await userEvent.click(
    screen.getByRole("button", { name: "Reserve static DHCP lease" })
  );

  expect(
    store.getActions().find((action) => action.type === "reservedip/create")
  ).toEqual({
    meta: {
      method: "create",
      model: "reservedip",
    },
    payload: {
      params: {
        subnet: 1,
        ip: "10.0.0.69",
        mac_address: "FF:FF:FF:FF:FF:FF",
        comment: "bla bla bla",
      },
    },
    type: "reservedip/create",
  });
});

it("pre-fills the form if a reserved IP's ID is present", async () => {
  const reservedIp = factory.reservedIp({
    id: 1,
    ip: "10.0.0.2",
    mac_address: "FF:FF:FF:FF:FF:FF",
    comment: "bla bla bla",
  });
  state.reservedip = factory.reservedIpState({
    loading: false,
    loaded: true,
    items: [reservedIp],
  });

  renderWithBrowserRouter(
    <ReserveDHCPLease
      reservedIpId={reservedIp.id}
      setSidePanelContent={vi.fn()}
      subnetId={state.subnet.items[0].id}
    />,
    { state }
  );

  expect(screen.getByRole("textbox", { name: "IP address" })).toHaveValue("2");
  expect(screen.getByRole("textbox", { name: "MAC address" })).toHaveValue(
    reservedIp.mac_address
  );
  expect(screen.getByRole("textbox", { name: "Comment" })).toHaveValue(
    reservedIp.comment
  );
});

it("pre-fills the form if a reserved IPv6 address's ID is present", async () => {
  const reservedIp = factory.reservedIp({
    id: 1,
    ip: "2001:db8::2",
    mac_address: "FF:FF:FF:FF:FF:FF",
    comment: "bla bla bla",
  });
  state.reservedip = factory.reservedIpState({
    loading: false,
    loaded: true,
    items: [reservedIp],
  });
  state.subnet.items = [factory.subnet({ id: 1, cidr: "2001:db8::/64" })];

  renderWithBrowserRouter(
    <ReserveDHCPLease
      reservedIpId={reservedIp.id}
      setSidePanelContent={vi.fn()}
      subnetId={state.subnet.items[0].id}
    />,
    { state }
  );

  expect(screen.getByRole("textbox", { name: "IP address" })).toHaveValue(":2");
  expect(screen.getByRole("textbox", { name: "MAC address" })).toHaveValue(
    reservedIp.mac_address
  );
  expect(screen.getByRole("textbox", { name: "Comment" })).toHaveValue(
    reservedIp.comment
  );
});

it("dispatches an action to update a reserved IP", async () => {
  const reservedIp = factory.reservedIp({
    id: 1,
    ip: "10.0.0.69",
    mac_address: "FF:FF:FF:FF:FF:FF",
    comment: "bla bla bla",
  });
  state.reservedip = factory.reservedIpState({
    loading: false,
    loaded: true,
    items: [reservedIp],
  });

  const store = mockStore(state);
  renderWithBrowserRouter(
    <ReserveDHCPLease
      reservedIpId={reservedIp.id}
      setSidePanelContent={vi.fn()}
      subnetId={state.subnet.items[0].id}
    />,
    { store }
  );

  await userEvent.clear(screen.getByRole("textbox", { name: "Comment" }));

  await userEvent.type(
    screen.getByRole("textbox", { name: "Comment" }),
    "something imaginative and funny"
  );

  await userEvent.click(
    screen.getByRole("button", { name: "Update static DHCP lease" })
  );

  expect(
    store.getActions().find((action) => action.type === "reservedip/update")
  ).toEqual({
    meta: {
      method: "update",
      model: "reservedip",
    },
    payload: {
      params: {
        subnet: 1,
        id: reservedIp.id,
        ip: "10.0.0.69",
        mac_address: "FF:FF:FF:FF:FF:FF",
        comment: "something imaginative and funny",
      },
    },
    type: "reservedip/update",
  });
});

it("displays an error if an invalid IPv6 address is entered", async () => {
  state.subnet.items = [factory.subnet({ id: 1, cidr: "2001:db8::/64" })];
  renderWithBrowserRouter(
    <ReserveDHCPLease
      setSidePanelContent={vi.fn()}
      subnetId={state.subnet.items[0].id}
    />,
    { state }
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "IP address" }),
    "420"
  );
  await userEvent.tab();

  expect(
    screen.getByText("This is not a valid IP address")
  ).toBeInTheDocument();
});

it("dispatches an action to create a reserved IPv6 address", async () => {
  state.subnet.items = [factory.subnet({ id: 1, cidr: "2001:db8::/64" })];
  const store = mockStore(state);
  renderWithBrowserRouter(
    <ReserveDHCPLease
      setSidePanelContent={vi.fn()}
      subnetId={state.subnet.items[0].id}
    />,
    { store }
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "IP address" }),
    ":69"
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "MAC address" }),
    "FF:FF:FF:FF:FF:FF"
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "Comment" }),
    "bla bla bla"
  );

  await userEvent.click(
    screen.getByRole("button", { name: "Reserve static DHCP lease" })
  );

  expect(
    store.getActions().find((action) => action.type === "reservedip/create")
  ).toEqual({
    meta: {
      method: "create",
      model: "reservedip",
    },
    payload: {
      params: {
        subnet: 1,
        ip: "2001:db8::69",
        mac_address: "FF:FF:FF:FF:FF:FF",
        comment: "bla bla bla",
      },
    },
    type: "reservedip/create",
  });
});
