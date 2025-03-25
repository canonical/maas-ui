import VirshTable from "./VirshTable";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { mockPools, poolsResolvers } from "@/testing/resolvers/pools";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
} from "@/testing/utils";

setupMockServer(
  poolsResolvers.listPools.handler(),
  poolsResolvers.getPool.handler(),
  zoneResolvers.getZone.handler()
);

describe("VirshTable", () => {
  let state: RootState;
  let pods = [
    factory.pod({ pool: 1, zone: 1 }),
    factory.pod({ pool: 2, zone: 2 }),
  ];
  beforeEach(() => {
    pods = [
      factory.pod({ pool: 1, zone: 1 }),
      factory.pod({ pool: 2, zone: 2 }),
    ];
    state = factory.rootState({
      pod: factory.podState({ items: pods, loaded: true }),
    });
  });

  it("shows pods sorted by descending name by default", () => {
    renderWithProviders(<VirshTable />, {
      route: "/kvm",
      state,
    });
    expect(
      screen.getByRole("button", { name: "Name (descending)" })
    ).toBeInTheDocument();
  });

  it("can sort by parameters of the pods themselves", async () => {
    state.pod.items[0].resources.vm_count.tracked = 1;
    state.pod.items[1].resources.vm_count.tracked = 2;
    renderWithProviders(<VirshTable />, {
      route: "/kvm",
      state,
    });
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
    const [firstPod, secondPod] = [state.pod.items[0], state.pod.items[1]];
    firstPod.pool = mockPools.items[0].id;
    secondPod.pool = mockPools.items[1].id;
    renderWithProviders(<VirshTable />, {
      route: "/kvm",
      state,
    });

    const getName = (rowNumber: number) =>
      screen.getAllByTestId("name")[rowNumber].textContent;

    // Sort pods by descending pool.
    await userEvent.click(
      screen.getByRole("button", { name: /Resource pool/i })
    );
    expect(
      screen.getByRole("button", { name: /Resource pool/i })
    ).toHaveAccessibleName("Resource pool (descending)");
    expect(getName(0)).toBe(secondPod.name); // gene

    // Reverse sort order
    await userEvent.click(
      screen.getByRole("button", { name: /Resource pool/i })
    );
    expect(
      screen.getByRole("button", { name: /Resource pool/i })
    ).toHaveAccessibleName("Resource pool (ascending)");
    expect(getName(0)).toBe(firstPod.name); // swimming
  });

  it("displays a message when empty", () => {
    state.pod.items = [];
    renderWithProviders(<VirshTable />, {
      route: "/kvm",
      state,
    });

    expect(screen.getByText("No pods available.")).toBeInTheDocument();
  });
});
