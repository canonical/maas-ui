import KVMStorageCards, { TRUNCATION_POINT } from "./KVMStorageCards";

import * as hooks from "@/app/base/hooks/analytics";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

describe("KVMStorageCards", () => {
  it("shows sort label as sorting by default then id if default pool id provided", () => {
    const pools = {
      a: factory.podStoragePoolResource(),
    };
    const state = factory.rootState();
    renderWithBrowserRouter(
      <KVMStorageCards defaultPoolId="a" pools={pools} />,
      { route: "/kvm/1", state }
    );
    expect(screen.getByTestId("sort-label")).toHaveTextContent(
      "(Sorted by id, default first)"
    );
  });

  it("shows sort label as sorting by name if no default pool id provided", () => {
    const pools = {
      a: factory.podStoragePoolResource(),
    };
    const state = factory.rootState();
    renderWithBrowserRouter(<KVMStorageCards pools={pools} />, {
      route: "/kvm/1",
      state,
    });
    expect(screen.getByTestId("sort-label")).toHaveTextContent(
      "(Sorted by name)"
    );
  });

  it("can expand truncated pools if above truncation point", async () => {
    const pools = {
      a: factory.podStoragePoolResource(),
      b: factory.podStoragePoolResource(),
      c: factory.podStoragePoolResource(),
      d: factory.podStoragePoolResource(),
      e: factory.podStoragePoolResource(),
    };
    const state = factory.rootState();
    renderWithBrowserRouter(<KVMStorageCards pools={pools} />, {
      route: "/kvm/1",
      state,
    });
    expect(
      screen.getByRole("button", { name: "2 more storage pools" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("group")).toHaveLength(TRUNCATION_POINT);
    await userEvent.click(
      screen.getByRole("button", { name: "2 more storage pools" })
    );
    expect(
      screen.getByRole("button", { name: "Show less storage pools" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("group")).toHaveLength(
      Object.keys(pools).length
    );
  });

  it("can send an analytics event when expanding pools if analytics enabled", async () => {
    const pools = {
      a: factory.podStoragePoolResource(),
      b: factory.podStoragePoolResource(),
      c: factory.podStoragePoolResource(),
      d: factory.podStoragePoolResource(),
      e: factory.podStoragePoolResource(),
    };
    const mockSendAnalytics = vi.fn();
    const mockUseSendAnalytics = vi
      .spyOn(hooks, "useSendAnalytics")
      .mockImplementation(() => mockSendAnalytics);

    const state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.ENABLE_ANALYTICS,
            value: false,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(<KVMStorageCards pools={pools} />, {
      route: "/kvm/1",
      state,
    });
    await userEvent.click(
      screen.getByRole("button", { name: "2 more storage pools" })
    );
    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "KVM details",
      "Toggle expanded storage pools",
      "Show more storage pools",
    ]);
    mockUseSendAnalytics.mockRestore();
  });
});
