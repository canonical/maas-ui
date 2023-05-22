import { render, screen } from "@testing-library/react";

import ScriptStatus from "./ScriptStatus";

import { ScriptResultStatus } from "app/store/scriptresult/types";

describe("ScriptStatus", () => {
  it("can show a passed icon", () => {
    render(<ScriptStatus status={ScriptResultStatus.PASSED} />);
    expect(screen.getByTestId("success-icon")).toBeInTheDocument();
  });

  it("can show a pending icon", () => {
    render(<ScriptStatus status={ScriptResultStatus.PENDING} />);
    expect(screen.getByTestId("pending-icon")).toBeInTheDocument();
  });

  it("can show a running icon", () => {
    render(<ScriptStatus status={ScriptResultStatus.RUNNING} />);
    expect(screen.getByTestId("running-icon")).toBeInTheDocument();
  });

  it("can show a failed icon", () => {
    render(<ScriptStatus status={ScriptResultStatus.FAILED} />);
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });

  it("can show a timed out icon", () => {
    render(<ScriptStatus status={ScriptResultStatus.TIMEDOUT} />);
    expect(screen.getByTestId("timed-out-icon")).toBeInTheDocument();
  });

  it("can show a skipped icon", () => {
    render(<ScriptStatus status={ScriptResultStatus.SKIPPED} />);
    expect(screen.getByTestId("warning-icon")).toBeInTheDocument();
  });

  it("makes the icon inline if children are provided", () => {
    render(<ScriptStatus status={ScriptResultStatus.PASSED}>{0}</ScriptStatus>);
    expect(
      screen.getByTestId("success-icon").classList.contains("is-inline")
    ).toBe(true);
  });

  it("does not make the icon inline if children are not provided", () => {
    render(<ScriptStatus status={ScriptResultStatus.PASSED} />);
    expect(
      screen.getByTestId("success-icon").classList.contains("is-inline")
    ).toBe(false);
  });

  it("can have its icon wrapped in a tooltip", () => {
    render(
      <ScriptStatus
        status={ScriptResultStatus.PASSED}
        tooltipMessage="Tooltip!"
        tooltipPosition="top-right"
      />
    );

    expect(screen.getByText(/Tooltip!/i)).toBeInTheDocument();
  });
});
