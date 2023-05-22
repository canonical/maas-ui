import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

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
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

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
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddMachineForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/add", store }
    );
    expect(
      screen.getByRole("combobox", { name: "min_hwe_kernel" })
    ).toHaveValue("ga-18.04");
  });

  it("can add extra mac address fields", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddMachineForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/add", store }
    );

    expect(screen.queryByTestId("extra-macs-0")).toBeNull();
    expect(screen.queryByTestId("extra-macs-1")).toBeNull();

    userEvent.click(screen.getByTestId("add-extra-mac"));

    expect(screen.getByTestId("extra-macs-0")).toBeInTheDocument();
    expect(screen.queryByTestId("extra-macs-1")).toBeNull();

    userEvent.click(screen.getByTestId("add-extra-mac"));

    expect(screen.getByTestId("extra-macs-0")).toBeInTheDocument();
    expect(screen.getByTestId("extra-macs-1")).toBeInTheDocument();
  });

  it("can remove extra mac address fields", async () => {
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <AddMachineForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/add", store }
    );

    userEvent.click(screen.getByTestId("add-extra-mac"));

    expect(screen.getByTestId("extra-macs-0")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("extra-macs-0--remove"));

    expect(screen.queryByTestId("extra-macs-0")).toBeNull();
  });

  it("does not require MAC address field if power_type is 'ipmi'", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddMachineForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/add", store }
    );

    expect(screen.getByLabelText(/pxe_mac/i)).toBeRequired();

    userEvent.selectOptions(screen.getByLabelText(/power_type/i), "ipmi");

    expect(screen.getByLabelText(/pxe_mac/i)).not.toBeRequired();
  });
});
