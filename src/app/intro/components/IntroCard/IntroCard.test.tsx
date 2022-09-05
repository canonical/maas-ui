import { screen, render } from "@testing-library/react";

import IntroCard from "./IntroCard";

describe("IntroCard", () => {
  it("displays a title link if supplied", () => {
    render(
      <IntroCard
        title="Setup MAAS"
        titleLink={
          <a data-testid="help-link" href="#help">
            Help!
          </a>
        }
      >
        Card content
      </IntroCard>
    );
    expect(screen.getByText("Help!")).toBeInTheDocument();
  });

  it("can display a green tick icon", () => {
    render(
      <IntroCard complete title="Setup MAAS">
        Card content
      </IntroCard>
    );
    const icon = screen.getByLabelText("success");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("p-icon--success");
  });

  it("can display an error icon", () => {
    render(
      <IntroCard hasErrors title="Setup MAAS">
        Card content
      </IntroCard>
    );
    const icon = screen.getByLabelText("error");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("p-icon--error");
  });

  it("can display a grey tick icon", () => {
    render(
      <IntroCard complete={false} title="Setup MAAS">
        Card content
      </IntroCard>
    );
    const icon = screen.getByLabelText("success-grey");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("p-icon--success-grey");
  });
});
