import { DomainDetailsSidePanelViews } from "../constants";

import DomainDetailsHeader, {
  Labels as DomainDetailsHeaderLabels,
} from "./DomainDetailsHeader";

import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter, userEvent } from "@/testing/utils";

describe("DomainDetailsHeader", () => {
  it("shows a spinner if domain details has not loaded yet", () => {
    const state = factory.rootState({
      domain: factory.domainState({ items: [factory.domain({ id: 1 })] }),
    });

    renderWithBrowserRouter(
      <DomainDetailsHeader id={1} setSidePanelContent={vi.fn()} />,
      {
        state,
      }
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows the domain name in the header if domain has loaded", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        items: [factory.domain({ id: 1, name: "domain-in-the-membrane" })],
      }),
    });
    renderWithBrowserRouter(
      <DomainDetailsHeader id={1} setSidePanelContent={vi.fn()} />,
      {
        state,
      }
    );

    expect(
      screen.getByRole("heading", { name: "domain-in-the-membrane" })
    ).toBeInTheDocument();
  });

  it("Shows the correct number of hosts and resource records once details loaded", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        loaded: true,
        items: [
          factory.domainDetails({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 5,
            resource_count: 9,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(
      <DomainDetailsHeader id={1} setSidePanelContent={vi.fn()} />,
      {
        state,
      }
    );

    expect(screen.getByText("5 hosts; 9 resource records")).toBeInTheDocument();
  });

  it("Shows only resource records if there are no hosts", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        loaded: true,
        items: [
          factory.domainDetails({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 0,
            resource_count: 9,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(
      <DomainDetailsHeader id={1} setSidePanelContent={vi.fn()} />,
      {
        state,
      }
    );

    expect(screen.getByText("9 resource records")).toBeInTheDocument();
  });

  it("shows only hosts if there are no resource records", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        loaded: true,
        items: [
          factory.domainDetails({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 5,
            resource_count: 0,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(
      <DomainDetailsHeader id={1} setSidePanelContent={vi.fn()} />,
      {
        state,
      }
    );

    expect(
      screen.getByText("5 hosts; No resource records")
    ).toBeInTheDocument();
  });

  it("shows the no records message if there is nothing", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        loaded: true,
        items: [
          factory.domainDetails({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 0,
            resource_count: 0,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(
      <DomainDetailsHeader id={1} setSidePanelContent={vi.fn()} />,
      {
        state,
      }
    );

    expect(screen.getByText("No resource records")).toBeInTheDocument();
  });

  it("does not show a button to delete domain if it is the default", () => {
    const state = factory.rootState({
      domain: factory.domainState({
        loaded: true,
        items: [
          factory.domainDetails({
            id: 0,
          }),
        ],
      }),
    });
    renderWithBrowserRouter(
      <DomainDetailsHeader id={0} setSidePanelContent={vi.fn()} />,
      {
        state,
      }
    );

    expect(
      screen.queryByRole("button", {
        name: DomainDetailsHeaderLabels.DeleteDomain,
      })
    ).not.toBeInTheDocument();
  });

  it("calls a function to open the side panel when the 'Add record' button is clicked", async () => {
    const state = factory.rootState({
      domain: factory.domainState({
        loaded: true,
        items: [
          factory.domainDetails({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 5,
            resource_count: 9,
          }),
        ],
      }),
    });
    const setSidePanelContent = vi.fn();

    renderWithBrowserRouter(
      <DomainDetailsHeader id={1} setSidePanelContent={setSidePanelContent} />,
      {
        state,
      }
    );

    await userEvent.click(screen.getByRole("button", { name: "Add record" }));
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: DomainDetailsSidePanelViews.ADD_RECORD,
    });
  });

  it("calls a function to open the side panel when the 'Delete domain' button is clicked", async () => {
    const state = factory.rootState({
      domain: factory.domainState({
        loaded: true,
        items: [
          factory.domainDetails({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 5,
            resource_count: 9,
          }),
        ],
      }),
    });
    const setSidePanelContent = vi.fn();

    renderWithBrowserRouter(
      <DomainDetailsHeader id={1} setSidePanelContent={setSidePanelContent} />,
      {
        state,
      }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Delete domain" })
    );
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: DomainDetailsSidePanelViews.DELETE_DOMAIN,
    });
  });
});
