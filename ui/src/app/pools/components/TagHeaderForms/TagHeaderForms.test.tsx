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
  expect(screen.getByText("Add tag form")).toBeInTheDocument();
});
