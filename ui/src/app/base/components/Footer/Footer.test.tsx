import React from "react";

import { render, screen } from "@testing-library/react";
import MockDate from "mockdate";

import { Footer } from "./Footer";

describe("Footer", () => {
  beforeEach(() => {
    MockDate.set("2020-01-01");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("displays the feedback link when analytics enabled", () => {
    render(<Footer debug={false} enableAnalytics={true} version="2.7.0" />);
    expect(
      screen.getByRole("link", { name: "Give feedback" })
    ).toBeInTheDocument();
  });

  it("hides the feedback link when analytics disabled", () => {
    render(<Footer debug={false} enableAnalytics={false} version="2.7.0" />);
    expect(
      screen.queryByRole("link", { name: "Give feedback" })
    ).not.toBeInTheDocument();
  });

  it("hides the feedback link in debug mode", () => {
    render(<Footer debug={true} enableAnalytics={true} version="2.7.0" />);
    expect(
      screen.queryByRole("link", { name: "Give feedback" })
    ).not.toBeInTheDocument();
  });
});
