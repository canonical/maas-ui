import { render, screen } from "@testing-library/react";

import EditableSection, { Labels } from "./EditableSection";

it("shows an edit button if content can be edited and not currently editing", () => {
  render(
    <EditableSection
      canEdit
      editing={false}
      setEditing={jest.fn()}
      title="Title"
    />
  );

  expect(
    screen.getByRole("button", { name: Labels.EditButton })
  ).toBeInTheDocument();
});

it("does not show an edit button if currently editing", () => {
  render(
    <EditableSection canEdit editing setEditing={jest.fn()} title="Title" />
  );

  expect(
    screen.queryByRole("button", { name: Labels.EditButton })
  ).not.toBeInTheDocument();
});

it("does not show an edit button if content cannot be edited", () => {
  render(
    <EditableSection
      canEdit={false}
      editing={false}
      setEditing={jest.fn()}
      title="Title"
    />
  );

  expect(
    screen.queryByRole("button", { name: Labels.EditButton })
  ).not.toBeInTheDocument();
});
