import TestResults from "./TestResults";

import { HardwareType } from "@/app/base/enum";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("TestResults", () => {
  let state: RootState;
  const machine = factory.machineDetails({ system_id: "abc123" });

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        items: [machine],
      }),
    });
  });

  it("renders a link with a count of passed cpu tests", () => {
    machine.cpu_test_status = factory.testStatus({
      passed: 2,
    });

    renderWithBrowserRouter(
      <TestResults
        hardwareType={HardwareType.CPU}
        machine={machine}
        setSidePanelContent={vi.fn()}
      />,
      {
        route: "/machine/abc123",
        state,
      }
    );

    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "href",
      "/machine/abc123/testing"
    );
  });

  it("renders a link with a count of pending and running memory tests", () => {
    machine.memory_test_status = factory.testStatus({
      running: 1,
      pending: 2,
    });

    renderWithBrowserRouter(
      <TestResults
        hardwareType={HardwareType.Memory}
        machine={machine}
        setSidePanelContent={vi.fn()}
      />,
      {
        route: "/machine/abc123",
        state,
      }
    );

    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute(
      "href",
      "/machine/abc123/testing"
    );
  });

  it("renders a link with a count of failed storage tests", () => {
    machine.storage_test_status = factory.testStatus({
      failed: 5,
    });

    renderWithBrowserRouter(
      <TestResults
        hardwareType={HardwareType.Storage}
        machine={machine}
        setSidePanelContent={vi.fn()}
      />,
      {
        route: "/machine/abc123",
        state,
      }
    );
    expect(screen.getByRole("link", { name: "5" })).toHaveAttribute(
      "href",
      "/machine/abc123/testing"
    );
  });

  it("renders a results link", () => {
    machine.cpu_test_status = factory.testStatus({
      failed: 5,
    });

    renderWithBrowserRouter(
      <TestResults
        hardwareType={HardwareType.CPU}
        machine={machine}
        setSidePanelContent={vi.fn()}
      />,
      {
        route: "/machine/abc123",
        state,
      }
    );
    expect(screen.getByRole("link", { name: /View results/i })).toHaveAttribute(
      "href",
      "/machine/abc123/testing"
    );
  });

  it("renders a test network link if no tests run", () => {
    machine.network_test_status = factory.testStatus();

    renderWithBrowserRouter(
      <TestResults
        hardwareType={HardwareType.Network}
        machine={machine}
        setSidePanelContent={vi.fn()}
      />,
      {
        route: "/machine/abc123",
        state,
      }
    );
    expect(
      screen.getByRole("button", { name: /Test network/i })
    ).toBeInTheDocument();
  });
});
