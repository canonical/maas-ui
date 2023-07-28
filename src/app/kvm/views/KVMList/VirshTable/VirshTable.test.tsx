import VirshTable from "./VirshTable";

import type { RootState } from "app/store/root/types";
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

describe("VirshTable", () => {
  let state: RootState;

  beforeEach(() => {
    const pods = [
      podFactory({ pool: 1, zone: 1 }),
      podFactory({ pool: 2, zone: 2 }),
    ];
    state = rootStateFactory({
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
    renderWithBrowserRouter(<VirshTable />, { route: "/kvm", state });
    expect(
      screen.getByRole("button", { name: "Name (descending)" })
    ).toBeInTheDocument();
  });

  it("can sort by parameters of the pods themselves", async () => {
    state.pod.items[0].resources.vm_count.tracked = 1;
    state.pod.items[1].resources.vm_count.tracked = 2;
    renderWithBrowserRouter(<VirshTable />, { route: "/kvm", state });
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];
    const getName = (rowNumber: number) =>
      screen.getAllByTestId("name")[rowNumber].textContent;

    // Pods are initially sorted by descending FQDN
    expect(screen.getByRole("button", { name: /Name/i })).toHaveAccessibleName(
      "Name (descending)"
    );

    // Click the VMs table header to order by descending VMs count
    await userEvent.click(screen.getByRole("button", { name: /VM s/i }));
    expect(screen.getByRole("button", { name: /VM s/i })).toHaveAccessibleName(
      "VM s (descending)"
    );
    expect(getName(0)).toBe(firstPod.name);

    // Click the VMs table header again to order by ascending VMs count
    await userEvent.click(screen.getByRole("button", { name: /VM s/i }));
    expect(screen.getByRole("button", { name: /VM s/i })).toHaveAccessibleName(
      "VM s (ascending)"
    );
    expect(getName(0)).toBe(secondPod.name);

    // Click the VMs table header again to remove sort
    await userEvent.click(screen.getByRole("button", { name: /VM s/i }));
    expect(screen.getByRole("button", { name: /VM s/i })).toHaveAccessibleName(
      "VM s"
    );
  });

  it("can sort by pod resource pool", async () => {
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
    state.resourcepool.items = pools;
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];
    firstPod.pool = pools[0].id;
    secondPod.pool = pools[1].id;
    renderWithBrowserRouter(<VirshTable />, { route: "/kvm", state });

    const getName = (rowNumber: number) =>
      screen.getAllByTestId("name")[rowNumber].textContent;

    // Sort pods by descending pool.
    await userEvent.click(
      screen.getByRole("button", { name: /Resource pool/i })
    );
    expect(
      screen.getByRole("button", { name: /Resource pool/i })
    ).toHaveAccessibleName("Resource pool (descending)");
    expect(getName(0)).toBe(firstPod.name);

    // Reverse sort order
    await userEvent.click(
      screen.getByRole("button", { name: /Resource pool/i })
    );
    expect(
      screen.getByRole("button", { name: /Resource pool/i })
    ).toHaveAccessibleName("Resource pool (ascending)");
    expect(getName(0)).toBe(secondPod.name);
  });
});
