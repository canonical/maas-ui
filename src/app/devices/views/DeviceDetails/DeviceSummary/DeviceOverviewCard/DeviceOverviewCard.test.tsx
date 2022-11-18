import { screen } from "@testing-library/react";
import configureStore from "redux-mock-store";

import DeviceOverviewCard from "./DeviceOverviewCard";

import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("DeviceOverviewCard", () => {
  it("shows a spinner for the note if not device details", () => {
    const device = deviceFactory();
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
    });
    const store = mockStore(state);
    renderWithMockStore(<DeviceOverviewCard systemId={device.system_id} />, {
      store,
    });

    expect(screen.getByTestId("loading-note")).toBeInTheDocument();
  });

  it("shows note if device is device details", () => {
    const device = deviceDetailsFactory({ description: "description" });
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
    });
    const store = mockStore(state);
    renderWithMockStore(<DeviceOverviewCard systemId={device.system_id} />, {
      store,
    });

    expect(screen.queryByTestId("loading-note")).not.toBeInTheDocument();
    expect(screen.getByTestId("device-note")).toHaveTextContent("description");
  });

  it("shows a spinner for the tags if tags have not loaded", () => {
    const device = deviceDetailsFactory();
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
      tag: tagStateFactory({ loaded: false }),
    });
    const store = mockStore(state);
    renderWithMockStore(<DeviceOverviewCard systemId={device.system_id} />, {
      store,
    });

    expect(screen.getByTestId("loading-tags")).toBeInTheDocument();
  });

  it("shows tag names if tags have loaded", () => {
    const device = deviceDetailsFactory({ tags: [1, 2] });
    const tags = [
      tagFactory({ id: 1, name: "tag1" }),
      tagFactory({ id: 2, name: "tag2" }),
    ];
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
      tag: tagStateFactory({ items: tags, loaded: true }),
    });
    const store = mockStore(state);
    renderWithMockStore(<DeviceOverviewCard systemId={device.system_id} />, {
      store,
    });

    expect(screen.queryByTestId("loading-tags")).not.toBeInTheDocument();
    expect(screen.getByTestId("device-tags")).toHaveTextContent("tag1, tag2");
  });
});
