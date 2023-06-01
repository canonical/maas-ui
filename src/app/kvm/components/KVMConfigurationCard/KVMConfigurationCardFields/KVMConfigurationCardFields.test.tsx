import KVMConfigurationCard from "../KVMConfigurationCard";

import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podFactory,
  podPowerParameters as powerParametersFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
  zoneState as zoneStateFactory,
  zone as zoneFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, within } from "testing/utils";

describe("KVMConfigurationCardFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({ items: [], loaded: true }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [resourcePoolFactory({ id: 1, name: "pool-1" })],
      }),
      zone: zoneStateFactory({
        items: [zoneFactory({ id: 1, name: "zone-1" })],
      }),
    });
  });

  it("correctly sets initial values for virsh pods", () => {
    const pod = podFactory({
      id: 1,
      power_parameters: powerParametersFactory({
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

    expect(screen.getByRole("textbox", { name: "KVM host type" })).toHaveValue(
      "Virsh"
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

  it("correctly sets initial values for lxd pods", () => {
    const pod = podFactory({
      id: 1,
      power_parameters: powerParametersFactory({
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
    const pod = podFactory({
      id: 1,
      power_parameters: powerParametersFactory({
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
