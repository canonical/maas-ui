import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { CompatRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDClusterDetailsRedirect, { Label } from "./LXDClusterDetailsRedirect";

import urls from "@/app/base/urls";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  render,
  screen,
  waitFor,
  renderWithBrowserRouter,
} from "@/testing/utils";

let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    pod: factory.podState({
      items: [factory.podDetails({ id: 2, type: PodType.LXD, cluster: 1 })],
      loaded: true,
    }),
    vmcluster: factory.vmClusterState({
      items: [factory.vmCluster({ id: 1 })],
      loaded: true,
    }),
  });
});

it("displays a spinner while loading", () => {
  state.pod.loaded = false;
  renderWithBrowserRouter(<LXDClusterDetailsRedirect clusterId={1} />, {
    route: urls.kvm.lxd.cluster.host.index({ clusterId: 1, hostId: 2 }),
    state,
  });
  expect(screen.getByLabelText(Label.Loading)).toBeInTheDocument();
});

it("displays a message if the host is not found", () => {
  state.pod.items = [];
  renderWithBrowserRouter(<LXDClusterDetailsRedirect clusterId={1} />, {
    route: urls.kvm.lxd.cluster.host.index({ clusterId: 1, hostId: 2 }),
    state,
  });
  expect(screen.getByText("LXD host not found")).toBeInTheDocument();
});

it("redirects to the config form", async () => {
  const history = createMemoryHistory({
    initialEntries: [
      {
        pathname: urls.kvm.lxd.cluster.host.index({ clusterId: 1, hostId: 2 }),
      },
    ],
  });
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <Router history={history}>
        <CompatRouter>
          <Routes>
            <Route
              element={<LXDClusterDetailsRedirect clusterId={1} />}
              path={urls.kvm.lxd.cluster.host.index(null)}
            />
          </Routes>
        </CompatRouter>
      </Router>
    </Provider>
  );
  await waitFor(() =>
    expect(history.location.pathname).toEqual(
      urls.kvm.lxd.cluster.host.edit({ clusterId: 1, hostId: 2 })
    )
  );
});
