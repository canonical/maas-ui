import { render, screen } from "@testing-library/react";

import Stepper from "./Stepper";

describe("Stepper", () => {
  it("renders", () => {
    render(
      <Stepper
        currentStep="step2"
        items={[
          { step: "step1", title: "Step 1" },
          { step: "step2", title: "Step 2" },
          { step: "step3", title: "Step 3" },
        ]}
      />
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders a step as checked if the index of the current step is higher", () => {
    render(
      <Stepper
        currentStep="step2"
        items={[
          { step: "step1", title: "Step 1" },
          { step: "step2", title: "Step 2" },
          { step: "step3", title: "Step 3" },
        ]}
      />
    );
    expect(screen.getByText("Step 1")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("Step 2")).toHaveAttribute("aria-checked", "false");
    expect(screen.getByText("Step 3")).toHaveAttribute("aria-checked", "false");
  });
});
