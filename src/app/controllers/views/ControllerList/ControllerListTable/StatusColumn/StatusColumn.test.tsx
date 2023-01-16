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
import { screen, renderWithBrowserRouter } from "testing/utils";

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
    expect(screen.getByTestId("controller-status-icon")).toHaveClass(
      "p-icon--success"
    );
  });
});
