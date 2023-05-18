import reduxToolkit from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";

import KVMResourcesCard from "./KVMResourcesCard";

import { actions as machineActions } from "app/store/machine";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podState as podStateFactory,
  rootState as rootStateFactory,
  pod as podFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("KVMResourcesCard", () => {
  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches machines on load", async () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, type: PodType.LXD })],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMResourcesCard id={1} />, {
      store,
      route: "/kvm/1/project",
    });

    const expectedAction = machineActions.fetch("mocked-nanoid");
    expect(
      store.getActions().some((action) => action.type === expectedAction.type)
    ).toBe(true);
  });

  it("shows a spinner if pods have not loaded yet", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
        loaded: false,
      }),
    });
    renderWithBrowserRouter(<KVMResourcesCard id={1} />, {
      state,
      route: "/kvm/1/project",
    });

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
