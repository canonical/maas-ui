import { screen } from "@testing-library/react";

import DetailsCard, { Labels as DetailsCardLabels } from "./DetailsCard";

import urls from "app/base/urls";
import { PowerTypeNames } from "app/store/general/constants";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  pod as podFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

let state: RootState;
beforeEach(() => {
  state = rootStateFactory({
    controller: controllerStateFactory({
      items: [],
    }),
    machine: machineStateFactory({
      items: [],
    }),
    general: generalStateFactory({
      powerTypes: powerTypesStateFactory({
        data: [],
        loaded: true,
      }),
    }),
  });
});

it("renders a link to zone configuration with edit permissions", () => {
  const machine = machineDetailsFactory({
    permissions: ["edit"],
    zone: { id: 1, name: "danger" },
  });
  state.machine.items = [machine];

  renderWithBrowserRouter(<DetailsCard node={machine} />, {
    route: "/machine/abc123",
    wrapperProps: { state },
  });

  expect(
    screen.getByRole("link", { name: DetailsCardLabels.ZoneLink })
  ).toBeInTheDocument();
  expect(screen.getByText("danger")).toBeInTheDocument();
});

it("renders a zone label without edit permissions", () => {
  const machine = machineDetailsFactory({
    permissions: [],
    zone: { id: 1, name: "danger" },
  });
  state.machine.items = [machine];

  renderWithBrowserRouter(<DetailsCard node={machine} />, {
    route: "/machine/abc123",
    wrapperProps: { state },
  });

  expect(
    screen.queryByRole("link", { name: DetailsCardLabels.ZoneLink })
  ).not.toBeInTheDocument();
  expect(screen.getByText(DetailsCardLabels.Zone)).toBeInTheDocument();
  expect(screen.getByText("danger")).toBeInTheDocument();
});

it("renders a formatted power type", () => {
  const machine = machineDetailsFactory({
    power_type: PowerTypeNames.LXD,
  });
  const powerType = powerTypeFactory({
    name: PowerTypeNames.LXD,
    description: "LXD (virtual systems)",
  });
  state.machine.items = [machine];
  state.general.powerTypes.data = [powerType];

  renderWithBrowserRouter(<DetailsCard node={machine} />, {
    route: "/machine/abc123",
    wrapperProps: { state },
  });

  expect(
    screen.getByRole("link", { name: DetailsCardLabels.PowerTypeLink })
  ).toBeInTheDocument();
  expect(screen.getByText("LXD")).toBeInTheDocument();
});

it("shows a spinner if tags are not loaded", () => {
  const machine = machineDetailsFactory({ tags: [1] });
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
    tag: tagStateFactory({
      items: [],
      loaded: false,
    }),
  });

  renderWithBrowserRouter(<DetailsCard node={machine} />, {
    route: "/machine/abc123",
    wrapperProps: { state },
  });

  expect(screen.getByText("Loading")).toBeInTheDocument();
});

it("renders a list of tags once loaded", () => {
  const machine = machineDetailsFactory({ tags: [1, 2, 3] });
  const tags = [
    tagFactory({ id: 1, name: "virtual" }),
    tagFactory({ id: 2, name: "test" }),
    tagFactory({ id: 3, name: "lxd" }),
  ];
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machine],
    }),
    tag: tagStateFactory({
      items: tags,
      loaded: true,
    }),
  });

  renderWithBrowserRouter(<DetailsCard node={machine} />, {
    route: "/machine/abc123",
    wrapperProps: { state },
  });

  expect(screen.getByText("lxd, test, virtual")).toBeInTheDocument();
});

describe("node is a controller", () => {
  it("does not render owner, host or pool information", () => {
    const controller = controllerDetailsFactory();
    state.controller.items = [controller];

    renderWithBrowserRouter(<DetailsCard node={controller} />, {
      wrapperProps: { state },
    });

    expect(screen.queryByText(DetailsCardLabels.Owner)).not.toBeInTheDocument();
    expect(screen.queryByText(DetailsCardLabels.Host)).not.toBeInTheDocument();
    expect(
      screen.queryByText(DetailsCardLabels.PoolLink)
    ).not.toBeInTheDocument();
  });
});

describe("node is a machine", () => {
  it("renders the owner", () => {
    const machine = machineDetailsFactory({ owner: "admin" });
    state.machine.items = [machine];

    renderWithBrowserRouter(<DetailsCard node={machine} />, {
      route: "/machine/abc123",
      wrapperProps: { state },
    });

    expect(screen.getByText(DetailsCardLabels.Owner)).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  it("renders host details for LXD machines", () => {
    const machine = machineDetailsFactory({
      pod: { id: 1, name: "lxd-pod" },
      power_type: PowerTypeNames.LXD,
    });
    const pod = podFactory({
      id: 1,
      name: "lxd-pod",
      type: PodType.LXD,
    });

    state.machine.items = [machine];
    state.pod.items = [pod];

    renderWithBrowserRouter(<DetailsCard node={machine} />, {
      route: "/machine/abc123",
      wrapperProps: { state },
    });

    expect(screen.getByText(DetailsCardLabels.Owner)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "lxd-pod ›" })).toHaveProperty(
      "href",
      `http://example.com${urls.kvm.lxd.single.index({ id: pod.id })}`
    );
  });

  it("renders host details for virsh machines", () => {
    const machine = machineDetailsFactory({
      pod: { id: 1, name: "virsh-pod" },
      power_type: PowerTypeNames.VIRSH,
    });
    const pod = podFactory({
      id: 1,
      name: "virsh-pod",
      type: PodType.VIRSH,
    });

    state.machine.items = [machine];
    state.pod.items = [pod];

    renderWithBrowserRouter(<DetailsCard node={machine} />, {
      route: "/machine/abc123",
      wrapperProps: { state },
    });

    expect(screen.getByText(DetailsCardLabels.Host)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "virsh-pod ›" })).toHaveProperty(
      "href",
      `http://example.com${urls.kvm.virsh.details.index({ id: pod.id })}`
    );
  });

  it("renders a link to resource pool configuration with edit permissions", () => {
    const machine = machineDetailsFactory({
      permissions: ["edit"],
      pool: { id: 1, name: "swimming" },
    });
    state.machine.items = [machine];

    renderWithBrowserRouter(<DetailsCard node={machine} />, {
      route: "/machine/abc123",
      wrapperProps: { state },
    });

    expect(
      screen.getByRole("link", { name: DetailsCardLabels.PoolLink })
    ).toBeInTheDocument();
    expect(screen.getByText("swimming")).toBeInTheDocument();
  });

  it("renders a resource pool label without edit permissions", () => {
    const machine = machineDetailsFactory({
      permissions: [],
      pool: { id: 1, name: "swimming" },
    });
    state.machine.items = [machine];

    renderWithBrowserRouter(<DetailsCard node={machine} />, {
      route: "/machine/abc123",
      wrapperProps: { state },
    });

    expect(
      screen.queryByRole("link", { name: DetailsCardLabels.PoolLink })
    ).not.toBeInTheDocument();
    expect(screen.getByText(DetailsCardLabels.Pool)).toBeInTheDocument();
    expect(screen.getByText("swimming")).toBeInTheDocument();
  });
});
