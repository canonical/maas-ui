import configureStore from "redux-mock-store";

import RefreshForm from "./RefreshForm";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("RefreshForm", () => {
  it("can show the processing status when refreshing the given KVM", async () => {
    const pod = factory.pod({ id: 1 });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
        statuses: factory.podStatuses({
          [pod.id]: factory.podStatus({ refreshing: true }),
        }),
      }),
    });

    renderWithBrowserRouter(
      <RefreshForm clearSidePanelContent={vi.fn()} hostIds={[1]} />,
      { state, route: "/kvm" }
    );

    expect(screen.getByTestId("saving-label")).toHaveTextContent(
      "Refreshing KVM host..."
    );
  });

  it("correctly dispatches actions to refresh given KVM", async () => {
    const pod = factory.pod({ id: 1 });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
        statuses: factory.podStatuses({
          [pod.id]: factory.podStatus({ refreshing: false }),
        }),
      }),
    });
    const store = mockStore(state);

    renderWithBrowserRouter(
      <RefreshForm clearSidePanelContent={vi.fn()} hostIds={[1, 2]} />,
      { store, route: "/kvm" }
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Refresh 2 KVM hosts/i })
    );

    expect(
      store.getActions().filter((action) => action.type === "pod/refresh")
    ).toStrictEqual([
      {
        type: "pod/refresh",
        meta: {
          model: "pod",
          method: "refresh",
        },
        payload: {
          params: {
            id: 1,
          },
        },
      },
      {
        type: "pod/refresh",
        meta: {
          model: "pod",
          method: "refresh",
        },
        payload: {
          params: {
            id: 2,
          },
        },
      },
    ]);
  });
});
