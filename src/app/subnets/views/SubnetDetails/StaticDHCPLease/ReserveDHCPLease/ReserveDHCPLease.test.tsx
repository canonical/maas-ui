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
    <ReserveDHCPLease setSidePanelContent={vi.fn()} subnetId={1} />,
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
    <ReserveDHCPLease setSidePanelContent={vi.fn()} subnetId={1} />,
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
    <ReserveDHCPLease setSidePanelContent={setSidePanelContent} subnetId={1} />,
    { state }
  );

  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(setSidePanelContent).toHaveBeenCalledWith(null);
});
