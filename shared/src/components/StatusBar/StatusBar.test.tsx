import { render, screen } from "@testing-library/react";
import React from "react";

import StatusBar from "./StatusBar";

describe("StatusBar", () => {
  it("shows the MAAS name", () => {
    render(<StatusBar maasName="foo" version="2.7.5" />);
    expect(screen.getByTestId("status-bar-maas-name")).toHaveTextContent(
      "foo MAAS"
    );
  });

  it("shows the MAAS version", () => {
    render(<StatusBar maasName="foo" version="2.7.5" />);
    expect(screen.getByTestId("status-bar-version")).toHaveTextContent("2.7.5");
  });

  it("can show a status", () => {
    render(
      <StatusBar maasName="foo" status="Activating charcoal" version="2.7.5" />
    );
    expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
      "Activating charcoal"
    );
  });
});
