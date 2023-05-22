import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

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

const mockStore = configureStore();

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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceFilterAccordion searchText="" setSearchText={jest.fn()} />,
      { route: "/devices", store }
    );

    expect(screen.getByTestId("filter-accordion")).toBeDisabled();
  });

  it("displays tags", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <DeviceFilterAccordion searchText="" setSearchText={jest.fn()} />,
      { route: "/devices", store }
    );
    // Open the menu:
    userEvent.click(screen.getByRole("button", { name: "Filter" }));

    expect(screen.getByText(/echidna\(1\)/i)).toBeInTheDocument();
  });
});
