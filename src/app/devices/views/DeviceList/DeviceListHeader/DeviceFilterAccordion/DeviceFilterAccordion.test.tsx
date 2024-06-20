import DeviceFilterAccordion from "./DeviceFilterAccordion";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

describe("DeviceFilterAccordion", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      device: factory.deviceState({
        items: [factory.device({ tags: [1] })],
        loaded: true,
      }),
      tag: factory.tagState({
        items: [factory.tag({ id: 1, name: "echidna" })],
      }),
    });
  });

  it("is disabled if devices haven't loaded yet", () => {
    state.device.loaded = false;

    renderWithBrowserRouter(
      <DeviceFilterAccordion searchText="" setSearchText={vi.fn()} />,
      { route: "/devices", state }
    );

    expect(screen.getByRole("button", { name: "Filters" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("displays tags", async () => {
    renderWithBrowserRouter(
      <DeviceFilterAccordion searchText="" setSearchText={vi.fn()} />,
      { route: "/devices", state }
    );
    // Open the menu:
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));

    expect(screen.getByText("echidna (1)")).toBeInTheDocument();
  });
});
