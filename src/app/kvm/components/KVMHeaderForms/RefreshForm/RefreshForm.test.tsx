import { render, screen } from 'testing/utils';
import RefreshForm from "./RefreshForm";
import configureStore from "redux-mock-store";
import { userEvent } from '@testing-library/react';

const mockStore = configureStore();

describe("RefreshForm", () => {
  it("can show the processing status when refreshing the given KVM", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ refreshing: true }),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <RefreshForm clearSidePanelContent={jest.fn()} hostIds={[1]} />, { route: “/kvm", store }
    );
    userEvent.click(screen.getByRole("button", { name: /Refres/i }));
    expect(screen.getByTestId("saving-label")).toHaveTextContent(
      /Refreshing KVM host.../i
    );
  });

  it("correctly dispatches actions to refresh given KVM", async () => {
    const pod = podFactory({ id: 1 });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
        statuses: podStatusesFactory({
          [pod.id]: podStatusFactory({ refreshing: false }),
        }),
      }),
    });
    const store = mockStore(state);

    renderWithBrowserRouter(
      <RefreshForm clearSidePanelContent={jest.fn()} hostIds={[1, 2]} />, { route: “/kvm", store }
    );
    userEvent.click(screen.getByRole("button", { name: /Refres/i }));
    expect(store.getActions().filter((action) => action.type === "pod/refresh")).toStrictEqual([
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