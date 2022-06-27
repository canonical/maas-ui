import { render, screen } from "@testing-library/react";

import LabelledList from "./LabelledList";

describe("LabelledList ", () => {
  it("can add additional classes", () => {
    render(<LabelledList className="extra-class" items={[]} />);

    expect(screen.getByRole("list")).toHaveClass("p-list--labelled");
    expect(screen.getByRole("list")).toHaveClass("extra-class");
  });
});
