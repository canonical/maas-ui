import { render } from "@testing-library/react";

import TagNameField from "./TagNameField";

import renderWithBrowserRouter from "testing/utils";

describe("TagNameField", () => {
  it("maps the initial value to the tag format", () => {
    const { container } = render(
      <TagNameField initialSelected={["koala", "wallaby"]} tags={[]} />
    );
    expect(container).toMatchSnapshot();
  });

  it("can override the field name", () => {
    const { container } = render(<TagNameField name="wombatTags" />);
    expect(container).toMatchSnapshot();
  });

  it("can populate the list of tags", () => {
    const { container } = render(<TagNameField tags={["koala", "wallaby"]} />);
    expect(container).toMatchSnapshot();
  });
});
