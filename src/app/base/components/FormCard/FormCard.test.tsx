import { render, screen } from "@testing-library/react";

import FormCard, { TestIds } from "./FormCard";

import { COL_SIZES } from "app/base/constants";

const { CARD_TITLE, SIDEBAR, TOTAL } = COL_SIZES;

describe("FormCard ", () => {
  it("can display the heading on a separate row", () => {
    render(
      <FormCard stacked title="Add user">
        Content
      </FormCard>
    );
    expect(screen.queryByTestId(TestIds.ColContent)).not.toBeInTheDocument();
  });

  it("occupies full width if neither sidebar or title is present", () => {
    render(
      <FormCard sidebar={false} title={null}>
        Content
      </FormCard>
    );

    expect(screen.getByTestId(TestIds.ColContent)).toHaveClass(`col-${TOTAL}`);
  });

  it("decreases column size if title is presnet", () => {
    render(
      <FormCard sidebar={false} title="Title">
        Content
      </FormCard>
    );

    expect(screen.getByTestId(TestIds.ColContent)).toHaveClass(
      `col-${TOTAL - CARD_TITLE}`
    );
  });

  it("decreases column size if sidebar is presnet", () => {
    render(
      <FormCard sidebar title={null}>
        Content
      </FormCard>
    );

    expect(screen.getByTestId(TestIds.ColContent)).toHaveClass(
      `col-${TOTAL - SIDEBAR}`
    );
  });

  it("decreases column size if title and sidebar are present", () => {
    render(
      <FormCard sidebar title="Title">
        Content
      </FormCard>
    );

    expect(screen.getByTestId(TestIds.ColContent)).toHaveClass(
      `col-${TOTAL - CARD_TITLE - SIDEBAR}`
    );
  });
});
