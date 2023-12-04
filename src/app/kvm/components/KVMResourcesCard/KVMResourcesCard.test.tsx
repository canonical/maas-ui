import KVMResourcesCard from "./KVMResourcesCard";

import urls from "@/app/base/urls";
import { PodType } from "@/app/store/pod/constants";
import {
  podState as podStateFactory,
  rootState as rootStateFactory,
  pod as podFactory,
} from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

describe("KVMResourcesCard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a spinner if pods have not loaded yet", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
        loaded: false,
      }),
    });
    renderWithBrowserRouter(<KVMResourcesCard id={1} />, {
      state,
      route: "/kvm/1/project",
    });

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("links to the VMs tab for a LXD pod", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, type: PodType.LXD })],
        loaded: true,
      }),
    });

    renderWithBrowserRouter(<KVMResourcesCard id={1} />, {
      state,
      route: "/kvm/1/project",
    });

    expect(screen.getByRole("link", { name: /Total VMs/ })).toHaveAttribute(
      "href",
      urls.kvm.lxd.single.vms({ id: 1 })
    );
  });

  it("displays VmResources for a Virsh pod", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, type: PodType.VIRSH })],
        loaded: true,
      }),
    });

    renderWithBrowserRouter(<KVMResourcesCard id={1} />, {
      state,
      route: "/kvm/1/project",
    });

    expect(
      screen.getByRole("button", { name: /Resource VMs/ })
    ).toBeInTheDocument();
  });
});
