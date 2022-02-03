import { render, screen, within } from "@testing-library/react";

import TitledSection from "./TitledSection";

it("displays the provided title and content", () => {
  const title = "echidna says";
  const content = "G'day";
  render(<TitledSection title={title}>{content}</TitledSection>);
  expect(screen.getByText(content)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
});

it("displays a section correctly labelled with the provided title", () => {
  const title = "echidna says";
  const content = "G'day";
  render(
    <TitledSection title={title}>
      <p>{content}</p>
    </TitledSection>
  );
  const section = screen.getByRole("region", { name: title });
  expect(within(section).getByText(content)).toBeInTheDocument();
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

it("can display buttons", () => {
  render(
    <TitledSection
      buttons={
        <>
          <button>Button</button>
          <button>Button</button>
        </>
      }
      title="echidna says"
    >
      G'day
    </TitledSection>
  );
  expect(screen.getAllByRole("button").length).toBe(2);
});

it("displays a custom heading level", () => {
  render(
    <TitledSection
      title="echidna says"
      headingElement="h4"
      headingVisuallyHidden={true}
    ></TitledSection>
  );

  expect(
    screen.getByRole("heading", { name: "echidna says", level: 4 })
  ).toBeInTheDocument();
});

it("adds a custom heading className", () => {
  render(
    <TitledSection title="echidna says" headingClassName="u-no-margin--bottom">
      G'day
    </TitledSection>
  );
  expect(screen.getByRole("heading")).toHaveAttribute(
    "class",
    "u-no-margin--bottom"
  );
});
