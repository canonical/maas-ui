import { VersionColumn } from "./VersionColumn";

import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

describe("VersionColumn", () => {
  const controller = factory.controller({
    system_id: "abc123",
  });

  it("can display the current version", () => {
    controller.versions = factory.controllerVersions({
      current: factory.controllerVersionInfo({ version: "1.2.3" }),
    });
    renderWithProviders(<VersionColumn controller={controller} />);
    expect(screen.getByTestId("version")).toHaveTextContent("1.2.3");
  });

  it("can display an unknown version", () => {
    controller.versions = factory.controllerVersions({
      current: factory.controllerVersionInfo({ version: undefined }),
    });
    renderWithProviders(<VersionColumn controller={controller} />);
    expect(screen.getByTestId("version")).toHaveTextContent(/Unknown/);
  });

  it("can display the origin", () => {
    controller.versions = factory.controllerVersions({
      origin: "latest/edge",
    });
    renderWithProviders(<VersionColumn controller={controller} />);
    expect(screen.getByTestId("origin")).toHaveTextContent("latest/edge");
  });

  it("can display a cohort tooltip", async () => {
    controller.versions = factory.controllerVersions({
      snap_cohort:
        "MSBzaFkyMllUWjNSaEpKRE9qME1mbVNoVE5aVEViMUppcSAxNjE3MTgyOTcxIGJhM2VlYzQ2NDc5ZDdmNTI3NzIzNTUyMmRlOTc1MGIzZmNhYTI0MDE1MTQ3ZjVhM2ViNzQwZGZmYzk5OWFiYWU=",
    });
    renderWithProviders(<VersionColumn controller={controller} />);

    await userEvent.click(screen.getByRole("button", { name: /information/i }));
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Cohort key: MSBzaFkyMllUWjNSaEpKRE9qME1mbVNoVE5aVEViM UppcSAxNjE3MTgyOTcxIGJhM2VlYzQ2NDc5ZDdmNT I3NzIzNTUyMmRlOTc1MGIzZmNhYTI0MDE1MTQ3ZjV hM2ViNzQwZGZmYzk5OWFiYWU="
    );
  });
});
