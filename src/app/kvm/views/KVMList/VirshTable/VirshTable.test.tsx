import configureStore from "redux-mock-store";

import VirshTable from "./VirshTable";

import { SortDirection } from "app/base/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore();

describe("VirshTable", () => {
  let initialState;

  beforeEach(() => {
    const pods = [
      podFactory({ pool: 1, zone: 1 }),
      podFactory({ pool: 2, zone: 2 }),
    ];
    initialState = rootStateFactory({
      pod: podStateFactory({ items: pods, loaded: true }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [
          resourcePoolFactory({ id: pods[0].pool }),
          resourcePoolFactory({ id: pods[1].pool }),
        ],
      }),
      zone: zoneStateFactory({
        items: [
          zoneFactory({ id: pods[0].zone }),
          zoneFactory({ id: pods[1].zone }),
        ],
      }),
    });
  });

  it("shows pods sorted by descending name by default", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithBrowserRouter(<VirshTable />, { route: "/kvm", store });
    expect(
      screen.getByTestId("name-header").querySelector("i")
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId("name-header")
        .querySelector("i")
        ?.classList.contains("p-icon--chevron-up")
    ).toBeFalsy();
  });

  it("can sort by parameters of the pods themselves", () => {
    const state = { ...initialState };
    state.pod.items[0].resources.vm_count.tracked = 1;
    state.pod.items[1].resources.vm_count.tracked = 2;
    const store = mockStore(state);
    renderWithBrowserRouter(<VirshTable />, { route: "/kvm", store });
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];
    const getName = (rowNumber) =>
      screen.getAllByTestId("name")[rowNumber].textContent;

    // Pods are initially sorted by descending FQDN
    expect(screen.getByTestId("vms-header").textContent).toContain("(current)");

    // Click the VMs table header to order by descending VMs count
    userEvent.click(screen.getByTestId("vms-header"));
    expect(screen.getByTestId("vms-header").textContent).toContain(
      "(descending)"
    );
    expect(getName(0)).toBe(firstPod.name);

    // Click the VMs table header again to order by ascending VMs count
    userEvent.click(screen.getByTestId("vms-header"));
    expect(screen.getByTestId("vms-header").textContent).toContain(
      "(ascending)"
    );
    expect(getName(0)).toBe(secondPod.name);

    // Click the VMs table header again to remove sort
    userEvent.click(screen.getByTestId("vms-header"));
    expect(screen.getByTestId("vms-header").textContent).not.toContain("(");
    expect(
      screen.getByTestId("vms-header").querySelector("i")
    ).not.toBeInTheDocument();
  });

  it("can sort by pod resource pool", () => {
    const pools = [
      resourcePoolFactory({
        id: 1,
        name: "first-pool",
      }),
      resourcePoolFactory({
        id: 2,
        name: "second-pool",
      }),
    ];
    const state = { ...initialState };
    state.resourcepool.items = pools;
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];
    firstPod.pool = pools[0].id;
    secondPod.pool = pools[1].id;
    const store = mockStore(state);
    renderWithBrowserRouter(<VirshTable />, { route: "/kvm", store });

    const getName = (rowNumber: number) =>
      screen.getAllByTestId("name")[rowNumber].textContent;

    // Sort pods by descending pool.
    userEvent.click(screen.getByTestId("pool-header"));
    expect(screen.getByTestId("pool-header").textContent).toContain(
      "(descending)"
    );
    expect(getName(0)).toBe(firstPod.name);

    // Reverse sort order
    userEvent.click(screen.getByTestId("pool-header"));
    expect(screen.getByTestId("pool-header").textContent).toContain(
      "(ascending)"
    );
    expect(getName(0)).toBe(secondPod.name);
  });
});
