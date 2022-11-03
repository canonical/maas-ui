import { screen } from "@testing-library/react";

import LXDClusterHostSettings, { Label } from "./LXDClusterHostSettings";

import urls from "app/base/urls";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("LXDClusterHostSettings", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podDetailsFactory({
            cluster: 1,
            id: 2,
            name: "pod1",
            type: PodType.LXD,
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a spinner if data is loading", () => {
    state.pod.loading = true;
    renderWithBrowserRouter(<LXDClusterHostSettings clusterId={2} />, {
      route: urls.kvm.lxd.cluster.host.edit({ clusterId: 1, hostId: 2 }),
      state,
      routePattern: urls.kvm.lxd.cluster.host.edit(null),
    });
    expect(screen.getByLabelText(Label.Loading)).toBeInTheDocument();
  });

  it("displays a message if the host is not found", () => {
    state.pod.items = [];
    renderWithBrowserRouter(<LXDClusterHostSettings clusterId={2} />, {
      route: urls.kvm.lxd.cluster.host.edit({ clusterId: 1, hostId: 2 }),
      state,
      routePattern: urls.kvm.lxd.cluster.host.edit(null),
    });
    expect(screen.getByText("LXD host not found")).toBeInTheDocument();
  });

  it("has a disabled zone field", () => {
    renderWithBrowserRouter(<LXDClusterHostSettings clusterId={2} />, {
      route: urls.kvm.lxd.cluster.host.edit({ clusterId: 1, hostId: 2 }),
      state,
      routePattern: urls.kvm.lxd.cluster.host.edit(null),
    });
    expect(screen.getByRole("combobox", { name: "Zone" })).toBeDisabled();
  });
});
