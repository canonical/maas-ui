import { render, screen } from "@testing-library/react";

import TagHeaderForms from "./TagHeaderForms";

import { TagHeaderViews } from "app/tags/constants";

it("can display the add tag form", () => {
  render(
    <TagHeaderForms
      headerContent={{ view: TagHeaderViews.AddTag }}
      setHeaderContent={jest.fn()}
    />
  );
  // TODO: Test for the form when it is implemented in:
  // https://github.com/canonical-web-and-design/app-tribe/issues/690
  expect(screen.getByText("Add tag form")).toBeInTheDocument();
});
