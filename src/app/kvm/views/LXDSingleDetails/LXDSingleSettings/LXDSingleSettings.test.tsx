import LXDSingleSettings, { Label } from "./LXDSingleSettings";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { poolsResolvers } from "@/testing/resolvers/pools";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  screen,
  renderWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  poolsResolvers.listPools.handler(),
  zoneResolvers.listZones.handler()
);

describe("LXDSingleSettings", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        items: [factory.podDetails({ id: 1, name: "pod1" })],
        loaded: true,
      }),
      tag: factory.tagState({
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const { store } = renderWithProviders(<LXDSingleSettings id={1} />, {
      state,
    });
    const expectedActionTypes = [
      "resourcepool/fetch",
      "tag/fetch",
      "zone/fetch",
    ];
    const actualActions = store.getActions();
    expectedActionTypes.forEach((expectedActionType) => {
      expect(
        actualActions.some(
          (actualAction) => actualAction.type === expectedActionType
        )
      );
    });
  });

  it("displays a spinner if data has not loaded", () => {
    renderWithProviders(<LXDSingleSettings id={1} />, { state });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays a permissions message without the view global entities entitlement", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({ entitlement: Entitlement.CAN_EDIT_MACHINES }),
      ])
    );
    renderWithProviders(<LXDSingleSettings id={1} />, { state });

    await waitFor(() => {
      expect(screen.getByText(Label.Permissions)).toBeInTheDocument();
    });
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
