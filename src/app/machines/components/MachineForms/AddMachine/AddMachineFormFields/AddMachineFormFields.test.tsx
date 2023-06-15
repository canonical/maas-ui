import AddMachineForm from "../AddMachineForm";

import type { RootState } from "app/store/root/types";
import {
  architecturesState as architecturesStateFactory,
  defaultMinHweKernelState as defaultMinHweKernelStateFactory,
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  hweKernelsState as hweKernelsStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  within,
} from "testing/utils";

describe("AddMachineFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory()],
        loaded: true,
      }),
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          data: ["amd64/generic"],
          loaded: true,
        }),
        defaultMinHweKernel: defaultMinHweKernelStateFactory({
          data: "ga-16.04",
          loaded: true,
        }),
        hweKernels: hweKernelsStateFactory({
          data: [
            ["ga-16.04", "xenial (ga-16.04)"],
            ["ga-18.04", "bionic (ga-18.04)"],
          ],
          loaded: true,
        }),
        powerTypes: powerTypesStateFactory({
          data: [
            powerTypeFactory({
              name: "manual",
              description: "Manual",
              fields: [],
            }),
            powerTypeFactory({
              name: "ipmi",
              description: "IPMI",
            }),
          ],
          loaded: true,
        }),
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory()],
        loaded: true,
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
        items: [zoneFactory()],
      }),
    });
  });

  it("correctly sets minimum kernel to default", () => {
    state.general.defaultMinHweKernel.data = "ga-18.04";
    renderWithBrowserRouter(
      <AddMachineForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/add", state }
    );

    expect(
      screen.getByRole("option", {
        name: "bionic (ga-18.04)",
        selected: true,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: "xenial (ga-16.04)",
        selected: false,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: "No minimum kernel",
        selected: false,
      })
    ).toBeInTheDocument();
  });

  it("can add extra mac address fields", async () => {
    renderWithBrowserRouter(
      <AddMachineForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/add", state }
    );

    expect(
      screen.queryByRole("textbox", { name: "Extra MAC address 1" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Extra MAC address 2" })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Add MAC address" })
    );

    expect(
      screen.getByRole("textbox", { name: "Extra MAC address 1" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Extra MAC address 2" })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Add MAC address" })
    );

    expect(
      screen.getByRole("textbox", { name: "Extra MAC address 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Extra MAC address 2" })
    ).toBeInTheDocument();
  });

  it("can remove extra mac address fields", async () => {
    renderWithBrowserRouter(
      <AddMachineForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/add", state }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Add MAC address" })
    );

    expect(screen.getByTestId("extra-macs-0")).toBeInTheDocument();

    await userEvent.click(
      within(screen.getByTestId("extra-macs-0")).getByRole("button")
    );

    expect(screen.queryByTestId("extra-macs-0")).not.toBeInTheDocument();
  });

  it("does not require MAC address field if power_type is 'ipmi'", async () => {
    renderWithBrowserRouter(
      <AddMachineForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/add", state }
    );

    expect(screen.getByRole("textbox", { name: "MAC address" })).toBeRequired();

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Power type" }),
      "ipmi"
    );

    expect(
      screen.getByRole("textbox", { name: "MAC address" })
    ).not.toBeRequired();
  });
});
