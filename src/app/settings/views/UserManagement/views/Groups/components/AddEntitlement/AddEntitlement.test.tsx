import AddEntitlement from "./AddEntitlement";

import {
  Entitlement,
  RestrictableEntitlements,
} from "@/app/settings/views/UserManagement/views/Groups/constants";
import { groupEntitlements as groupEntitlementsFactory } from "@/testing/factories/groups";
import { groupsResolvers } from "@/testing/resolvers/groups";
import { mockPools, poolsResolvers } from "@/testing/resolvers/pools";
import {
  userEvent,
  screen,
  setupMockServer,
  renderWithProviders,
  waitFor,
  mockSidePanel,
} from "@/testing/utils";

const mockServer = setupMockServer(
  groupsResolvers.addGroupEntitlement.handler(),
  groupsResolvers.listGroupEntitlements.handler(),
  poolsResolvers.listPools.handler()
);
const { mockClose } = await mockSidePanel();

describe("AddEntitlement", () => {
  it("runs closeForm function when the cancel button is clicked", async () => {
    renderWithProviders(<AddEntitlement group_id={1} />);

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls add group entitlement on save click", async () => {
    renderWithProviders(<AddEntitlement group_id={1} />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /entitlement/i }),
      Entitlement.CAN_DEPLOY_MACHINES
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Add entitlement/i })
    );

    await waitFor(() => {
      expect(groupsResolvers.addGroupEntitlement.resolved).toBeTruthy();
    });
  });

  it("displays error message when add group entitlement fails", async () => {
    mockServer.use(
      groupsResolvers.addGroupEntitlement.error({
        code: 400,
        message: "Uh oh!",
      })
    );

    renderWithProviders(<AddEntitlement group_id={1} />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /entitlement/i }),
      Entitlement.CAN_DEPLOY_MACHINES
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Add entitlement/i })
    );

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });

  it("renders conditional fields correctly based on entitlement and pool selection", async () => {
    renderWithProviders(<AddEntitlement group_id={1} />);

    // 1. Entitlement select and is_restricted checkbox are visible
    expect(
      screen.getByRole("combobox", { name: /entitlement/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /restrict to pool/i })
    ).toBeInTheDocument();

    // 2. is_restricted checkbox and submit button are disabled before entitlement selection
    expect(
      screen.getByRole("checkbox", { name: /restrict to pool/i })
    ).toBeAriaDisabled();
    expect(
      screen.getByRole("button", { name: /Add entitlement/i })
    ).toBeAriaDisabled();

    // 3. Select a restrictable entitlement
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /entitlement/i }),
      RestrictableEntitlements[0]
    );

    // 4. is_restricted checkbox and submit button are now enabled
    expect(
      screen.getByRole("checkbox", { name: /restrict to pool/i })
    ).not.toBeAriaDisabled();
    expect(
      screen.getByRole("button", { name: /Add entitlement/i })
    ).not.toBeAriaDisabled();

    // 5. Check the is_restricted checkbox
    await userEvent.click(
      screen.getByRole("checkbox", { name: /restrict to pool/i })
    );

    // 6. Submit button is disabled (pool not yet selected) and pool select appears
    expect(
      screen.getByRole("button", { name: /Add entitlement/i })
    ).toBeAriaDisabled();
    expect(screen.getByRole("combobox", { name: /pool/i })).toBeInTheDocument();

    // 7. Select a pool — submit button becomes enabled
    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: /pool/i })
      ).not.toBeAriaDisabled();
    });
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /pool/i }),
      String(mockPools.items[0].id)
    );
    expect(
      screen.getByRole("button", { name: /Add entitlement/i })
    ).not.toBeAriaDisabled();
  });

  it("keeps the submit button disabled and shows a message for a global duplicate entitlement", async () => {
    mockServer.use(
      groupsResolvers.listGroupEntitlements.handler({
        items: [
          groupEntitlementsFactory({
            entitlement: Entitlement.CAN_VIEW_NOTIFICATIONS,
            resource_type: "maas",
            resource_id: 0,
          }),
        ],
        total: 1,
      })
    );
    renderWithProviders(<AddEntitlement group_id={1} />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /entitlement/i }),
      Entitlement.CAN_VIEW_NOTIFICATIONS
    );

    expect(
      screen.getByText(/This entitlement already exists in the group/i)
    ).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: /Add entitlement/i,
    });
    expect(submitButton).toBeAriaDisabled();

    // moving focus elsewhere on the form should not re-enable the button
    await userEvent.tab();
    expect(submitButton).toBeAriaDisabled();
  });

  it("disables submit only when a pool-scoped entitlement matches the same pool", async () => {
    mockServer.use(
      groupsResolvers.listGroupEntitlements.handler({
        items: [
          groupEntitlementsFactory({
            entitlement: RestrictableEntitlements[0],
            resource_type: "pool",
            resource_id: mockPools.items[0].id,
          }),
        ],
        total: 1,
      })
    );
    renderWithProviders(<AddEntitlement group_id={1} />);

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /entitlement/i }),
      RestrictableEntitlements[0]
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: /restrict to pool/i })
    );

    // selecting a different pool keeps the button enabled
    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: /pool/i })
      ).not.toBeAriaDisabled();
    });
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /pool/i }),
      String(mockPools.items[1].id)
    );
    expect(
      screen.getByRole("button", { name: /Add entitlement/i })
    ).not.toBeAriaDisabled();
    expect(
      screen.queryByText(/This entitlement already exists in the group/i)
    ).not.toBeInTheDocument();

    // selecting the same pool as the existing entitlement disables the button
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /pool/i }),
      String(mockPools.items[0].id)
    );
    expect(
      screen.getByRole("button", { name: /Add entitlement/i })
    ).toBeAriaDisabled();
    expect(
      screen.getByText(/This entitlement already exists in the group/i)
    ).toBeInTheDocument();
  });
});
