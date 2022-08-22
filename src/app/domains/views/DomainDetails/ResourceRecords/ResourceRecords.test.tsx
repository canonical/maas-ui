import { screen } from "@testing-library/react";

import ResourceRecords, {
  Labels as ResourceRecordsLabels,
} from "./ResourceRecords";

import {
  domainDetails as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("ResourceRecords", () => {
  it("shows a message if domain has no records", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, rrsets: [] })],
      }),
    });

    renderWithBrowserRouter(<ResourceRecords id={1} />, {
      wrapperProps: { state },
    });

    expect(
      screen.getByText(ResourceRecordsLabels.NoRecords)
    ).toBeInTheDocument();
  });

  it("displays a loading spinner with text when loading", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [],
        loading: true,
      }),
    });
    renderWithBrowserRouter(<ResourceRecords id={1} />, {
      wrapperProps: { state },
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
