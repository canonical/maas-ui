import { VersionColumn } from "./VersionColumn";

import { ControllerInstallType } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  controllerVersions as controllerVersionsFactory,
  controllerVersionInfo as controllerVersionInfoFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

describe("VersionColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [
          controllerFactory({
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("can display the current version", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      current: controllerVersionInfoFactory({ version: "1.2.3" }),
    });
    renderWithBrowserRouter(<VersionColumn systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByTestId("version")).toHaveTextContent("1.2.3");
  });

  it("can display an unknown version", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      current: controllerVersionInfoFactory({ version: undefined }),
    });
    renderWithBrowserRouter(<VersionColumn systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByTestId("version")).toHaveTextContent(/Unknown/);
  });

  it("can display the origin", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      origin: "latest/edge",
    });
    renderWithBrowserRouter(<VersionColumn systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByTestId("origin")).toHaveTextContent("latest/edge");
  });

  it("can display the origin when it is a deb", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      install_type: ControllerInstallType.DEB,
      origin: "stable",
    });
    renderWithBrowserRouter(<VersionColumn systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByTestId("origin")).toHaveTextContent(/Deb/);
    expect(screen.getByRole("tooltip")).toHaveTextContent("stable");
  });

  it("can display a cohort tooltip", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      snap_cohort:
        "MSBzaFkyMllUWjNSaEpKRE9qME1mbVNoVE5aVEViMUppcSAxNjE3MTgyOTcxIGJhM2VlYzQ2NDc5ZDdmNTI3NzIzNTUyMmRlOTc1MGIzZmNhYTI0MDE1MTQ3ZjVhM2ViNzQwZGZmYzk5OWFiYWU=",
    });
    renderWithBrowserRouter(<VersionColumn systemId="abc123" />, {
      route: "/controllers",
      state,
    });
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Cohort key: MSBzaFkyMllUWjNSaEpKRE9qME1mbVNoVE5aVEViM UppcSAxNjE3MTgyOTcxIGJhM2VlYzQ2NDc5ZDdmNT I3NzIzNTUyMmRlOTc1MGIzZmNhYTI0MDE1MTQ3ZjV hM2ViNzQwZGZmYzk5OWFiYWU="
    );
  });
});
