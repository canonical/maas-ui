import "@testing-library/jest-dom/extend-expect";
import DiskTestStatus from "./DiskTestStatus";

import { ScriptResultStatus } from "app/store/scriptresult/types";
import { render, screen } from "testing/utils";

describe("DiskTestStatus", () => {
  it("can show passed test status", () => {
    render(<DiskTestStatus testStatus={ScriptResultStatus.PASSED} />);
    expect(screen.getByLabelText(/ok/)).toBeInTheDocument();
  });

  it("can show running test status", () => {
    render(<DiskTestStatus testStatus={ScriptResultStatus.RUNNING} />);
    expect(screen.getByLabelText(/running/i)).toBeInTheDocument();
  });

  it("can show pending test status", () => {
    render(<DiskTestStatus testStatus={ScriptResultStatus.PENDING} />);
    expect(screen.getByLabelText(/pending/)).toBeInTheDocument();
  });

  it("can show error test status", () => {
    render(<DiskTestStatus testStatus={ScriptResultStatus.FAILED} />);
    expect(screen.getByLabelText(/error/)).toBeInTheDocument();
  });

  it("can show timed out test status", () => {
    render(<DiskTestStatus testStatus={ScriptResultStatus.TIMEDOUT} />);
    expect(screen.getByLabelText(/timed out/)).toBeInTheDocument();
  });

  it("can show warning test status", () => {
    render(<DiskTestStatus testStatus={ScriptResultStatus.SKIPPED} />);
    expect(screen.getByLabelText(/skipped/)).toBeInTheDocument();
  });

  it("can show unknown test status", () => {
    render(<DiskTestStatus testStatus={ScriptResultStatus.NONE} />);
    expect(screen.getByLabelText(/unknown/)).toBeInTheDocument();
  });
});
