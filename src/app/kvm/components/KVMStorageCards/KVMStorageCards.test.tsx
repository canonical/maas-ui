import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import KVMStorageCards, { TRUNCATION_POINT } from "./KVMStorageCards";

import {
  podStoragePoolResource as podStoragePoolFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("KVMStorageCards", () => {
  it("shows sort label as sorting by default then id if default pool id provided", () => {
    const pools = {
      a: podStoragePoolFactory(),
    };
    const state = rootStateFactory();
    const store = mockStore(state);
    renderWithBrowserRouter(
      <KVMStorageCards defaultPoolId="a" pools={pools} />,
      { route: "/kvm/1", store }
    );
    expect(screen.getByTestId("sort-label")).toHaveTextContent(
      "(Sorted by id, default first)"
    );
  });

  it("shows sort label as sorting by name if no default pool id provided", () => {
    const pools = {
      a: podStoragePoolFactory(),
    };
    const state = rootStateFactory();
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMStorageCards pools={pools} />, {
      route: "/kvm/1",
      store,
    });
    expect(screen.getByTestId("sort-label")).toHaveTextContent(
      "(Sorted by name)"
    );
  });

  it("can expand truncated pools if above truncation point", () => {
    const pools = {
      a: podStoragePoolFactory(),
      b: podStoragePoolFactory(),
      c: podStoragePoolFactory(),
      d: podStoragePoolFactory(),
      e: podStoragePoolFactory(),
    };
    const state = rootStateFactory();
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMStorageCards pools={pools} />, {
      route: "/kvm/1",
      store,
    });
    expect(
      screen.getByRole("button", { name: "Show more storage pools" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(TRUNCATION_POINT);
    userEvent.click(
      screen.getByRole("button", { name: "Show more storage pools" })
    );
    expect(
      screen.getByRole("button", { name: "Show less storage pools" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(
      Object.keys(pools).length
    );
  });

  it("can send an analytics event when expanding pools if analytics enabled", () => {
    const pools = {
      a: podStoragePoolFactory(),
      b: podStoragePoolFactory(),
      c: podStoragePoolFactory(),
      d: podStoragePoolFactory(),
      e: podStoragePoolFactory(),
    };
    const mockSendAnalytics = jest.fn();
    const mockUseSendAnalytics = jest
      .spyOn(hooks, "useSendAnalytics")
      .mockImplementation(() => mockSendAnalytics);

    const state = rootStateFactory({
      config: {
        items: [{ name: ConfigNames.ENABLE_ANALYTICS, value: true }],
      },
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<KVMStorageCards pools={pools} />, {
      route: "/kvm/1",
      store,
    });
    userEvent.click(
      screen.getByRole("button", { name: "Show more storage pools" })
    );
    expect(mockSendAnalytics).toHaveBeenCalledWith(
      "KVM details",
      "Toggle expanded storage pools",
      "Show more storage pools"
    );
    mockUseSendAnalytics.mockRestore();
  });
});
