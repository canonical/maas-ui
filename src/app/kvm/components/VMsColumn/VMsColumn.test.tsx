import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMsColumn from "./VMsColumn";

import { PodType } from "@/app/store/pod/constants";
import * as factory from "@/testing/factories";

const mockStore = configureStore();

describe("VMsColumn", () => {
  it("displays the pod's tracked VMs", () => {
    const pod = factory.pod({
      id: 1,
      resources: factory.podResources({
        vm_count: factory.podVmCount({ tracked: 10 }),
      }),
    });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <VMsColumn version={pod.version} vms={pod.resources.vm_count.tracked} />
      </Provider>
    );
    expect(screen.getByTestId("machines-count")).toHaveTextContent("10");
  });

  it("shows the pod version for LXD pods", () => {
    const pod = factory.pod({ id: 1, type: PodType.LXD, version: "1.2.3" });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });

    const store = mockStore(state);
    render(
      <Provider store={store}>
        <VMsColumn version={pod.version} vms={pod.resources.vm_count.tracked} />
      </Provider>
    );
    expect(screen.getByTestId("version")).toHaveTextContent("1.2.3");
  });
});
