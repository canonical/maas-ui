import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import ClearAllForm, { Labels as ClearAllFormLabels } from "./ClearAllForm";

import { ConfigNames, NetworkDiscovery } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";
import { screen, waitFor, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("ClearAllForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          {
            name: ConfigNames.NETWORK_DISCOVERY,
            value: NetworkDiscovery.ENABLED,
          },
        ],
      }),
      discovery: discoveryStateFactory({
        loaded: true,
        items: [
          discoveryFactory({
            hostname: "my-discovery-test",
          }),
          discoveryFactory({
            hostname: "another-test",
          }),
        ],
      }),
    });
  });

  it("displays a message when discovery is enabled", () => {
    state.config = configStateFactory({
      items: [
        {
          name: ConfigNames.NETWORK_DISCOVERY,
          value: NetworkDiscovery.ENABLED,
        },
      ],
    });
    renderWithBrowserRouter(<ClearAllForm closeForm={jest.fn()} />, {
      route: "/dashboard",
      state,
    });
    expect(screen.getByTestId("enabled-message")).toBeInTheDocument();
  });

  it("displays a message when discovery is disabled", () => {
    state.config = configStateFactory({
      items: [
        {
          name: ConfigNames.NETWORK_DISCOVERY,
          value: NetworkDiscovery.DISABLED,
        },
      ],
    });
    renderWithBrowserRouter(<ClearAllForm closeForm={jest.fn()} />, {
      route: "/dashboard",
      state,
    });
    expect(screen.getByTestId("disabled-message")).toBeInTheDocument();
  });

  it("dispatches an action to clear the discoveries", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<ClearAllForm closeForm={jest.fn()} />, {
      route: "/dashboard",
      store,
    });
    await userEvent.click(
      screen.getByRole("button", { name: ClearAllFormLabels.SubmitLabel })
    );
    expect(
      store.getActions().some(({ type }) => type === "discovery/clear")
    ).toBe(true);
  });

  it("shows a success message when completed", async () => {
    mockFormikFormSaved();

    const store = mockStore(state);
    renderWithBrowserRouter(<ClearAllForm closeForm={jest.fn()} />, {
      route: "/dashboard",
      store,
    });

    await userEvent.click(
      screen.getByRole("button", { name: ClearAllFormLabels.SubmitLabel })
    );
    await waitFor(() => {
      expect(
        store.getActions().some(({ type }) => type === "message/add")
      ).toBe(true);
    });
  });
});
