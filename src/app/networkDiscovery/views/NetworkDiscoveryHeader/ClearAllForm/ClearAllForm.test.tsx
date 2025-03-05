import configureStore from "redux-mock-store";

import ClearAllForm, { Labels as ClearAllFormLabels } from "./ClearAllForm";

import { ConfigNames, NetworkDiscovery } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { mockFormikFormSaved } from "@/testing/mockFormikFormSaved";
import {
  userEvent,
  screen,
  renderWithBrowserRouter,
  waitFor,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ClearAllForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          {
            name: ConfigNames.NETWORK_DISCOVERY,
            value: NetworkDiscovery.ENABLED,
          },
        ],
      }),
      discovery: factory.discoveryState({
        loaded: true,
        items: [
          factory.discovery({
            hostname: "my-discovery-test",
          }),
          factory.discovery({
            hostname: "another-test",
          }),
        ],
      }),
    });
  });

  it("displays a message when discovery is enabled", () => {
    state.config = factory.configState({
      items: [
        {
          name: ConfigNames.NETWORK_DISCOVERY,
          value: NetworkDiscovery.ENABLED,
        },
      ],
    });
    renderWithBrowserRouter(<ClearAllForm closeForm={vi.fn()} />, {
      route: "/network-discovery",
      state,
    });
    expect(screen.getByTestId("enabled-message")).toBeInTheDocument();
  });

  it("displays a message when discovery is disabled", () => {
    state.config = factory.configState({
      items: [
        {
          name: ConfigNames.NETWORK_DISCOVERY,
          value: NetworkDiscovery.DISABLED,
        },
      ],
    });
    renderWithBrowserRouter(<ClearAllForm closeForm={vi.fn()} />, {
      route: "/network-discovery",
      state,
    });
    expect(screen.getByTestId("disabled-message")).toBeInTheDocument();
  });

  it("dispatches an action to clear the discoveries", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<ClearAllForm closeForm={vi.fn()} />, {
      route: "/network-discovery",
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
    renderWithBrowserRouter(<ClearAllForm closeForm={vi.fn()} />, {
      route: "/network-discovery",
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
