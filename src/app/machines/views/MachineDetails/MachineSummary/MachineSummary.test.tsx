import MachineSummary from "./MachineSummary";

import type { RootState } from "app/store/root/types";
import { NodeStatusCode } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("MachineSummary", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner if machines are loading", () => {
    state.machine.items = [];
    renderWithBrowserRouter(
      <MachineSummary setSidePanelContent={jest.fn()} />,
      {
        route: "/machine/abc123/summary",
        routePattern: "/machine/:id/summary",
        state,
      }
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders", () => {
    renderWithBrowserRouter(
      <MachineSummary setSidePanelContent={jest.fn()} />,
      {
        route: "/machine/abc123/summary",
        routePattern: "/machine/:id/summary",
        state,
      }
    );

    expect(screen.getByText("Machine Status")).toBeInTheDocument();
    expect(screen.getByText("CPU")).toBeInTheDocument();
    expect(screen.getByText("Memory")).toBeInTheDocument();
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Zone/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Resource pool/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Power type/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tags/i })).toBeInTheDocument();
    expect(screen.getByText("Hardware Information")).toBeInTheDocument();
    expect(screen.getByLabelText("Numa nodes")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Network/i })).toBeInTheDocument();
  });

  it("shows workload annotations for deployed machines", () => {
    state.machine.items = [
      machineDetailsFactory({
        status_code: NodeStatusCode.DEPLOYED,
        system_id: "abc123",
      }),
    ];
    renderWithBrowserRouter(
      <MachineSummary setSidePanelContent={jest.fn()} />,
      {
        route: "/machine/abc123/summary",
        routePattern: "/machine/:id/summary",
        state,
      }
    );
    expect(screen.getByText("Workload annotations")).toBeInTheDocument();
  });

  it("shows workload annotations for allocated machines", () => {
    state.machine.items = [
      machineDetailsFactory({
        status_code: NodeStatusCode.ALLOCATED,
        system_id: "abc123",
      }),
    ];
    renderWithBrowserRouter(
      <MachineSummary setSidePanelContent={jest.fn()} />,
      {
        route: "/machine/abc123/summary",
        routePattern: "/machine/:id/summary",
        state,
      }
    );
    expect(screen.getByText("Workload annotations")).toBeInTheDocument();
  });

  it("does not show workload annotations for machines that are neither deployed nor allocated", () => {
    state.machine.items = [
      machineDetailsFactory({
        status_code: NodeStatusCode.NEW,
        system_id: "abc123",
      }),
    ];
    renderWithBrowserRouter(
      <MachineSummary setSidePanelContent={jest.fn()} />,
      {
        route: "/machine/abc123/summary",
        routePattern: "/machine/:id/summary",
        state,
      }
    );
    expect(screen.queryByText("Workload annotations")).not.toBeInTheDocument();
  });
});
