import ZonesTable from "@/app/zones/components/ZonesTable/ZonesTable";
import * as factory from "@/testing/factories";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  renderWithProviders,
  setupMockServer,
  waitFor,
  screen,
} from "@/testing/utils";

const mockServer = setupMockServer(
  zoneResolvers.listZones.handler(),
  zoneResolvers.getZone.handler()
);

describe("ZonesTable", () => {
  it("disables the delete button without permissions", async () => {
    mockServer.use(
      zoneResolvers.listZones.handler({
        items: [factory.zone()],
        total: 1,
      })
    );
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ is_superuser: false }),
        }),
      }),
    });
    renderWithProviders(<ZonesTable />, { state });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
        "is-disabled"
      );
    });
  });

  it("enables the delete button with correct permissions", async () => {
    mockServer.use(
      zoneResolvers.listZones.handler({
        items: [factory.zone()],
        total: 1,
      })
    );
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ is_superuser: true }),
        }),
      }),
    });
    renderWithProviders(<ZonesTable />, { state });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Delete" })).not.toHaveClass(
        "is-disabled"
      );
    });
  });

  it("disables the delete button for default pools", async () => {
    mockServer.use(
      zoneResolvers.listZones.handler({
        items: [
          factory.zone({
            id: 1,
            name: "default",
            description: "default",
          }),
        ],
        total: 1,
      })
    );

    renderWithProviders(<ZonesTable />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Delete" })).toBeAriaDisabled();
    });
  });
});
