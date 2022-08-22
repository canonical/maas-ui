import { screen } from "@testing-library/react";

import DomainDetailsHeader, {
  Labels as DomainDetailsHeaderLabels,
} from "./DomainDetailsHeader";

import {
  domain as domainFactory,
  domainDetails as domainDetailsFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("DomainDetailsHeader", () => {
  it("shows a spinner if domain details has not loaded yet", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({ items: [domainFactory({ id: 1 })] }),
    });

    renderWithBrowserRouter(<DomainDetailsHeader id={1} />, {
      wrapperProps: { state },
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows the domain name in the header if domain has loaded", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, name: "domain-in-the-membrane" })],
      }),
    });
    renderWithBrowserRouter(<DomainDetailsHeader id={1} />, {
      wrapperProps: { state },
    });

    expect(
      screen.getByRole("heading", { name: "domain-in-the-membrane" })
    ).toBeInTheDocument();
  });

  it("Shows the correct number of hosts and resource records once details loaded", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainDetailsFactory({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 5,
            resource_count: 9,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(<DomainDetailsHeader id={1} />, {
      wrapperProps: { state },
    });

    expect(screen.getByText("5 hosts; 9 resource records")).toBeInTheDocument();
  });

  it("Shows only resource records if there are no hosts", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainDetailsFactory({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 0,
            resource_count: 9,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(<DomainDetailsHeader id={1} />, {
      wrapperProps: { state },
    });

    expect(screen.getByText("9 resource records")).toBeInTheDocument();
  });

  it("shows only hosts if there are no resource records", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainDetailsFactory({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 5,
            resource_count: 0,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(<DomainDetailsHeader id={1} />, {
      wrapperProps: { state },
    });

    expect(
      screen.getByText("5 hosts; No resource records")
    ).toBeInTheDocument();
  });

  it("shows the no records message if there is nothing", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainDetailsFactory({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 0,
            resource_count: 0,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(<DomainDetailsHeader id={1} />, {
      wrapperProps: { state },
    });

    expect(screen.getByText("No resource records")).toBeInTheDocument();
  });

  it("does not show a button to delete domain if it is the default", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainDetailsFactory({
            id: 0,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(<DomainDetailsHeader id={0} />, {
      wrapperProps: { state },
    });

    expect(
      screen.queryByRole("button", {
        name: DomainDetailsHeaderLabels.DeleteDomain,
      })
    ).not.toBeInTheDocument();
  });
});
