import { ControllerStatus } from "./ControllerStatus";

import type { RootState } from "@/app/store/root/types";
import { ServiceStatus } from "@/app/store/service/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
  service as serviceFactory,
  serviceState as serviceStateFactory,
} from "@/testing/factories";
import {
  screen,
  renderWithBrowserRouter,
  userEvent,
  expectTooltipOnHover,
} from "@/testing/utils";

const getIcon = () => screen.getByTestId("controller-status-icon");

describe("ControllerStatus", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        items: [
          controllerFactory({
            system_id: "abc123",
            service_ids: [1, 2],
          }),
        ],
      }),
    });
  });

  it("handles a dead controller", async () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: ServiceStatus.DEAD,
        }),
        serviceFactory({
          id: 2,
          status: ServiceStatus.DEAD,
        }),
      ],
    });
    renderWithBrowserRouter(<ControllerStatus systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(getIcon()).toHaveClass("p-icon--power-error");
    await expectTooltipOnHover(screen.getByRole("button"), "2 dead");
  });

  it("handles a degraded controller", async () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: ServiceStatus.DEGRADED,
        }),
        serviceFactory({
          id: 2,
          status: ServiceStatus.DEGRADED,
        }),
      ],
    });
    renderWithBrowserRouter(<ControllerStatus systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(getIcon()).toHaveClass("p-icon--warning");
    await expectTooltipOnHover(getIcon(), "2 degraded");
  });

  it("handles a running controller", async () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: ServiceStatus.RUNNING,
        }),
        serviceFactory({
          id: 2,
          status: ServiceStatus.RUNNING,
        }),
      ],
    });
    renderWithBrowserRouter(<ControllerStatus systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(getIcon()).toHaveClass("p-icon--success");
    await expectTooltipOnHover(getIcon(), "2 running");
  });

  it("handles a powered off controller", async () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: ServiceStatus.OFF,
        }),
        serviceFactory({
          id: 2,
          status: ServiceStatus.OFF,
        }),
      ],
    });
    renderWithBrowserRouter(<ControllerStatus systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(getIcon()).toHaveClass("p-icon--power-off");
    await expectTooltipOnHover(getIcon(), "2 off");
  });

  it("handles a controller with unknown status", async () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: ServiceStatus.UNKNOWN,
        }),
        serviceFactory({
          id: 2,
          status: ServiceStatus.UNKNOWN,
        }),
      ],
    });
    renderWithBrowserRouter(<ControllerStatus systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(getIcon()).toHaveClass("p-icon--power-unknown");
    await userEvent.hover(getIcon());
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
