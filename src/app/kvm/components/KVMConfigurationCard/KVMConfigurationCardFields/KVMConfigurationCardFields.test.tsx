import KVMConfigurationCard from "../KVMConfigurationCard";

import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  renderWithBrowserRouter,
  screen,
  setupMockServer,
  waitFor,
  within,
} from "@/testing/utils";

setupMockServer(zoneResolvers.listZones.handler());

describe("KVMConfigurationCardFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({ items: [], loaded: true }),
      resourcepool: factory.resourcePoolState({
        loaded: true,
        items: [factory.resourcePool({ id: 1, name: "pool-1" })],
      }),
    });
  });

  it("correctly sets initial values for virsh pods", async () => {
    const pod = factory.podDetails({
      id: 1,
      power_parameters: factory.podPowerParameters({
        power_address: "abc123",
        power_pass: "maxpower",
      }),
      pool: 1,
      zone: 1,
      type: PodType.VIRSH,
    });
    state.pod.items = [pod];
    renderWithBrowserRouter(<KVMConfigurationCard pod={pod} />, {
      route: "/kvm/1/edit",
      state,
    });
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());

    expect(screen.getByRole("textbox", { name: "KVM host type" })).toHaveValue(
      "Virsh"
    );
    await waitFor(() =>
      expect(
        (
          within(screen.getByRole("combobox", { name: "Zone" })).getByRole(
            "option",
            { name: "zone-1" }
          ) as HTMLOptionElement
        ).selected
      ).toBe(true)
    );
    expect(
      (
        within(
          screen.getByRole("combobox", { name: "Resource pool" })
        ).getByRole("option", { name: "pool-1" }) as HTMLOptionElement
      ).selected
    ).toBe(true);
    expect(
      screen.getByRole("spinbutton", { name: "CPU overcommit" })
    ).toHaveValue(pod.cpu_over_commit_ratio);
    expect(
      screen.getByRole("spinbutton", { name: "Memory overcommit" })
    ).toHaveValue(pod.memory_over_commit_ratio);
  });

  it("correctly sets initial values for lxd pods", async () => {
    const pod = factory.podDetails({
      id: 1,
      power_parameters: factory.podPowerParameters({
        power_address: "abc123",
      }),
      pool: 1,
      zone: 1,
      type: PodType.LXD,
    });
    state.pod.items = [pod];
    renderWithBrowserRouter(<KVMConfigurationCard pod={pod} />, {
      route: "/kvm/1/edit",
      state,
    });
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());
    expect(screen.getByRole("textbox", { name: "KVM host type" })).toHaveValue(
      "LXD"
    );
    expect(
      (
        within(screen.getByRole("combobox", { name: "Zone" })).getByRole(
          "option",
          { name: "zone-1" }
        ) as HTMLOptionElement
      ).selected
    ).toBe(true);
    expect(
      (
        within(
          screen.getByRole("combobox", { name: "Resource pool" })
        ).getByRole("option", { name: "pool-1" }) as HTMLOptionElement
      ).selected
    ).toBe(true);
    expect(
      screen.getByRole("spinbutton", { name: "CPU overcommit" })
    ).toHaveValue(pod.cpu_over_commit_ratio);
    expect(
      screen.getByRole("spinbutton", { name: "Memory overcommit" })
    ).toHaveValue(pod.memory_over_commit_ratio);
  });

  it("can disable the zone field", () => {
    const pod = factory.podDetails({
      id: 1,
      power_parameters: factory.podPowerParameters({
        power_address: "abc123",
      }),
      type: PodType.LXD,
    });
    state.pod.items = [pod];
    renderWithBrowserRouter(<KVMConfigurationCard pod={pod} zoneDisabled />, {
      route: "/kvm/1/edit",
      state,
    });
    expect(screen.getByRole("combobox", { name: "Zone" })).toBeDisabled();
  });
});
