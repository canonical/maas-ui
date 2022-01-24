import { render, screen } from "@testing-library/react";

import Definition from "./Definition";

it("renders term and description correctly", () => {
  render(<Definition label="Term" description="description text" />);
  expect(screen.getByText("description text")).toBeInTheDocument();
  expect(screen.getByText("Term")).toBeInTheDocument();
});

it("renders description provided as children correctly", () => {
  render(<Definition label="Term">description child text</Definition>);
  expect(screen.getByText("description child text")).toBeInTheDocument();
  expect(screen.getByText("Term")).toBeInTheDocument();
});

it("displays alternative text with no description provided", () => {
  render(<Definition label="Term">{undefined}</Definition>);
  expect(screen.getByText("Term")).toBeInTheDocument();
  expect(screen.getByText("—")).toBeInTheDocument();
});
