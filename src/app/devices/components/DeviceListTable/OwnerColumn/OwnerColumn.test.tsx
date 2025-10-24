import { screen } from "@testing-library/react";
import configureStore from "redux-mock-store";

import OwnerColumn from "./OwnerColumn";

import * as factory from "@/testing/factories";
import { renderWithProviders } from "@/testing/utils";

const mockStore = configureStore();

describe("OwnerColumn", () => {
  it("shows a spinner if tags have not loaded", () => {
    const device = factory.device();
    const state = factory.rootState({
      device: factory.deviceState({ items: [device] }),
      tag: factory.tagState({ loaded: false }),
    });
    const store = mockStore(state);
    renderWithProviders(<OwnerColumn systemId={device.system_id} />, { store });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows tag names once loaded", () => {
    const device = factory.device({ tags: [1, 2] });
    const state = factory.rootState({
      device: factory.deviceState({ items: [device] }),
      tag: factory.tagState({
        items: [
          factory.tag({ id: 1, name: "tag1" }),
          factory.tag({ id: 2, name: "tag2" }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    renderWithProviders(<OwnerColumn systemId={device.system_id} />, { store });

    expect(screen.getByTitle("tag1, tag2")).toBeInTheDocument();
  });
});
