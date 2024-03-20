import { ControllerStatus } from "./ControllerStatus";

import type { RootState } from "@/app/store/root/types";
import { ServiceStatus } from "@/app/store/service/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter, userEvent } from "@/testing/utils";

const getIcon = () => screen.getByTestId("controller-status-icon");

describe("ControllerStatus", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      controller: factory.controllerState({
        items: [
          factory.controller({
            system_id: "abc123",
            service_ids: [1, 2],
          }),
        ],
      }),
    });
  });

  it("handles a dead controller", async () => {
    state.service = factory.serviceState({
      items: [
        factory.service({
          id: 1,
          status: ServiceStatus.DEAD,
        }),
        factory.service({
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
    await userEvent.hover(getIcon());
    await vi.waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("2 dead");
    });
  });

  it("handles a degraded controller", async () => {
    state.service = factory.serviceState({
      items: [
        factory.service({
          id: 1,
          status: ServiceStatus.DEGRADED,
        }),
        factory.service({
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
    await userEvent.hover(getIcon());
    await vi.waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("2 degraded");
    });
  });

  it("handles a running controller", async () => {
    state.service = factory.serviceState({
      items: [
        factory.service({
          id: 1,
          status: ServiceStatus.RUNNING,
        }),
        factory.service({
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
    await userEvent.hover(getIcon());
    await vi.waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("2 running");
    });
  });

  it("handles a powered off controller", async () => {
    state.service = factory.serviceState({
      items: [
        factory.service({
          id: 1,
          status: ServiceStatus.OFF,
        }),
        factory.service({
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
    await userEvent.hover(getIcon());
    await vi.waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("2 off");
    });
  });

  it("handles a controller with unknown status", async () => {
    state.service = factory.serviceState({
      items: [
        factory.service({
          id: 1,
          status: ServiceStatus.UNKNOWN,
        }),
        factory.service({
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
