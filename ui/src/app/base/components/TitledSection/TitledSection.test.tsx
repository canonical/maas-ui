import { render, screen, within } from "@testing-library/react";

import TitledSection from "./TitledSection";

it("displays the provided title and content", () => {
  const title = "echidna says";
  const content = "G'day";
  render(<TitledSection title={title}>{content}</TitledSection>);
  expect(screen.getByText(content)).toBeInTheDocument();
  expect(
    within(screen.getByRole("heading")).getByText(title)
  ).toBeInTheDocument();
});

it("sets the labelledby ids", () => {
  render(<TitledSection title="echidna says">G'day</TitledSection>);
  const sectionId = screen.getByRole("heading").id;
  expect(sectionId).toBeTruthy();
  expect(screen.getByTestId("titled-section")).toHaveAttribute(
    "aria-labelledby",
    sectionId
  );
});
