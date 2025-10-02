import { VersionColumn } from "./VersionColumn";

import { ControllerInstallType } from "@/app/store/controller/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

describe("VersionColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      controller: factory.controllerState({
        loaded: true,
        items: [
          factory.controller({
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("can display the current version", () => {
    state.controller.items[0].versions = factory.controllerVersions({
      current: factory.controllerVersionInfo({ version: "1.2.3" }),
    });
    renderWithProviders(<VersionColumn systemId="abc123" />, {
      initialEntries: ["/controllers"],
      state,
    });
    expect(screen.getByTestId("version")).toHaveTextContent("1.2.3");
  });

  it("can display an unknown version", () => {
    state.controller.items[0].versions = factory.controllerVersions({
      current: factory.controllerVersionInfo({ version: undefined }),
    });
    renderWithProviders(<VersionColumn systemId="abc123" />, {
      initialEntries: ["/controllers"],
      state,
    });
    expect(screen.getByTestId("version")).toHaveTextContent(/Unknown/);
  });

  it("can display the origin", () => {
    state.controller.items[0].versions = factory.controllerVersions({
      origin: "latest/edge",
    });
    renderWithProviders(<VersionColumn systemId="abc123" />, {
      initialEntries: ["/controllers"],
      state,
    });
    expect(screen.getByTestId("origin")).toHaveTextContent("latest/edge");
  });

  it("can display the origin when it is a deb", async () => {
    state.controller.items[0].versions = factory.controllerVersions({
      install_type: ControllerInstallType.DEB,
      origin: "stable",
    });
    renderWithProviders(<VersionColumn systemId="abc123" />, {
      initialEntries: ["/controllers"],
      state,
    });
    expect(screen.getByTestId("origin")).toHaveTextContent(/Deb/);
    await userEvent.click(screen.getByRole("button", { name: /information/i }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("stable");
  });

  it("can display a cohort tooltip", async () => {
    state.controller.items[0].versions = factory.controllerVersions({
      snap_cohort:
        "MSBzaFkyMllUWjNSaEpKRE9qME1mbVNoVE5aVEViMUppcSAxNjE3MTgyOTcxIGJhM2VlYzQ2NDc5ZDdmNTI3NzIzNTUyMmRlOTc1MGIzZmNhYTI0MDE1MTQ3ZjVhM2ViNzQwZGZmYzk5OWFiYWU=",
    });
    renderWithProviders(<VersionColumn systemId="abc123" />, {
      initialEntries: ["/controllers"],
      state,
    });

    await userEvent.click(screen.getByRole("button", { name: /information/i }));
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Cohort key: MSBzaFkyMllUWjNSaEpKRE9qME1mbVNoVE5aVEViM UppcSAxNjE3MTgyOTcxIGJhM2VlYzQ2NDc5ZDdmNT I3NzIzNTUyMmRlOTc1MGIzZmNhYTI0MDE1MTQ3ZjV hM2ViNzQwZGZmYzk5OWFiYWU="
    );
  });
});
