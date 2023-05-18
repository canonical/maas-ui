import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import StorageColumn from "./StorageColumn";

import {
  pod as podFactory,
  podResource as podResourceFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  vmClusterResource as vmClusterResourceFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("StorageColumn", () => {
  it("displays correct storage information for a pod", () => {
    const pod = podFactory({
      id: 1,
      name: "pod-1",
      resources: podResourcesFactory({
        storage: podResourceFactory({
          allocated_other: 30000000000,
          allocated_tracked: 70000000000,
          free: 900000000000,
        }),
      }),
    });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <StorageColumn
          defaultPoolId={pod.default_storage_pool}
          pools={{}}
          storage={pod.resources.storage}
        />
      </Provider>
    );
    expect(screen.getByText(/0.1 of 1TB allocated/i)).toBeInTheDocument();
    const segmentWidths = [
      "width: 7.000000000000001%",
      "width: 3%",
      "width: 90%;",
    ];
    const segments = screen.getAllByTestId("meter-filled");
    expect(segments[0]).toHaveStyle(segmentWidths[0]);
    expect(segments[1]).toHaveStyle(segmentWidths[1]);
    expect(segments[2]).toHaveStyle(segmentWidths[2]);
  });

  it("displays correct storage information for a vmcluster", () => {
    const resources = vmClusterResourceFactory({
      allocated_other: 1,
      allocated_tracked: 2,
      free: 3,
    });
    const store = mockStore(rootStateFactory());
    render(
      <Provider store={store}>
        <StorageColumn pools={{}} storage={resources} />
      </Provider>
    );
    expect(screen.getByText(/2 of 6B allocated/i)).toBeInTheDocument();

    const segmentWidths = [
      "width: 33.33333333333333%",
      "width: 16.666666666666664%",
      "width: 50%;",
    ];
    const segments = screen.getAllByTestId("meter-filled");
    expect(segments[0]).toHaveStyle(segmentWidths[0]);
    expect(segments[1]).toHaveStyle(segmentWidths[1]);
    expect(segments[2]).toHaveStyle(segmentWidths[2]);
  });
});
