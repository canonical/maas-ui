import DeviceFilterAccordion from "./DeviceFilterAccordion";

import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

describe("DeviceFilterAccordion", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceFactory({ tags: [1] })],
        loaded: true,
      }),
      tag: tagStateFactory({
        items: [tagFactory({ id: 1, name: "echidna" })],
      }),
    });
  });

  it("is disabled if devices haven't loaded yet", () => {
    state.device.loaded = false;

    renderWithBrowserRouter(
      <DeviceFilterAccordion searchText="" setSearchText={jest.fn()} />,
      { route: "/devices", state }
    );

    expect(screen.getByRole("button", { name: "Filters" })).toBeDisabled();
  });

  it("displays tags", async () => {
    renderWithBrowserRouter(
      <DeviceFilterAccordion searchText="" setSearchText={jest.fn()} />,
      { route: "/devices", state }
    );
    // Open the menu:
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));

    expect(screen.getByText("echidna (1)")).toBeInTheDocument();
  });
});
