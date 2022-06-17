import { render, screen } from "@testing-library/react";

import Definition from "./Definition";

it("renders term and description correctly", () => {
  render(<Definition description="description text" label="Term" />);
  expect(screen.getByText("description text")).toBeInTheDocument();
  expect(screen.getByText("Term")).toBeInTheDocument();
});

it("renders description provided as children correctly", () => {
  render(<Definition label="Term">description child text</Definition>);
  expect(screen.getByText("description child text")).toBeInTheDocument();
  expect(screen.getByText("Term")).toBeInTheDocument();
});

it("renders multiple children correctly", () => {
  render(
    <Definition label="Term">
      <a href="#1">link1</a>
      <a href="#2">link2</a>
    </Definition>
  );
  expect(screen.getByRole("link", { name: "link1" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "link2" })).toBeInTheDocument();
  expect(screen.getByText("Term")).toBeInTheDocument();
});

it("displays alternative text with no description provided", () => {
  render(
    <Definition label="Term">
      {undefined}
      {null}
    </Definition>
  );
  expect(screen.getByText("Term")).toBeInTheDocument();
  expect(screen.getByText("—")).toBeInTheDocument();
});

it("displays alternative text for empty string as description", () => {
  // eslint-disable-next-line prettier/prettier
  render(<Definition label="Term">{""}</Definition>);
  expect(screen.getByText("Term")).toBeInTheDocument();
  expect(screen.getByText("—")).toBeInTheDocument();
});
