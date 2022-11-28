import { screen } from "@testing-library/react";

import { StatusColumn } from "./StatusColumn";

import { ControllerVersionIssues } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import { ServiceStatus } from "app/store/service/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  controllerVersions as controllerVersionsFactory,
  rootState as rootStateFactory,
  service as serviceFactory,
  serviceState as serviceStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("StatusColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [
          controllerFactory({
            system_id: "abc123",
            service_ids: [1, 2],
          }),
        ],
      }),
      service: serviceStateFactory({
        items: [
          serviceFactory({
            id: 1,
            status: ServiceStatus.RUNNING,
          }),
          serviceFactory({
            id: 2,
            status: ServiceStatus.RUNNING,
          }),
        ],
      }),
    });
  });

  it("displays a warning if there is a version error", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      issues: [ControllerVersionIssues.DIFFERENT_CHANNEL],
    });
    renderWithBrowserRouter(<StatusColumn systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByTestId("version-error")).toBeInTheDocument();
  });

  it("displays the controller status if there are no errors", () => {
    renderWithBrowserRouter(<StatusColumn systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByRole("tooltip")).toHaveTextContent("2 running");
    // TODO: Add check for status icon once https://github.com/canonical/maas-ui/pull/4594 is merged
  });
});
