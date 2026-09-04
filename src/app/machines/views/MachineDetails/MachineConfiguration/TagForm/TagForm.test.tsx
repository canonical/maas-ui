import TagForm from "./TagForm";

import { Labels as EditableSectionLabels } from "@/app/base/components/EditableSection";
import urls from "@/app/base/urls";
import { Label as TagFormFieldsLabel } from "@/app/machines/components/MachineForms/MachineActionFormWrapper/TagForm/TagFormFields";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { FilterMachines } from "@/app/store/machine/utils";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  userEvent,
  screen,
  setupMockServer,
  waitFor,
  renderWithProviders,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("TagForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            permissions: ["edit"],
            system_id: "abc123",
            tags: [1, 2],
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
      tag: factory.tagState({
        items: [
          factory.tag({ id: 1, name: "tag-1" }),
          factory.tag({ id: 2, name: "tag-2" }),
        ],
        loaded: true,
      }),
    });
  });

  it("is not editable if machine does not have edit permission", () => {
    state.machine.items[0].permissions = [];
    renderWithProviders(<TagForm systemId="abc123" />, { state });

    expect(
      screen.queryByRole("button", { name: EditableSectionLabels.EditButton })
    ).not.toBeInTheDocument();
  });

  it("is editable if machine has edit permission", () => {
    state.machine.items[0].permissions = ["edit"];
    renderWithProviders(<TagForm systemId="abc123" />, { state });

    expect(
      screen.getAllByRole("button", { name: EditableSectionLabels.EditButton })
        .length
    ).not.toBe(0);
  });

  it("renders list of tag links until edit button is pressed", async () => {
    renderWithProviders(<TagForm systemId="abc123" />, { state });

    expect(screen.queryByLabelText("tag-form")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "tag-1" })).toHaveAttribute(
      "href",
      `${urls.machines.index}${FilterMachines.filtersToQueryString({
        tags: ["=tag-1"],
      })}`
    );
    expect(screen.getByRole("link", { name: "tag-2" })).toHaveAttribute(
      "href",
      `${urls.machines.index}${FilterMachines.filtersToQueryString({
        tags: ["=tag-2"],
      })}`
    );

    const editButton = screen.getAllByRole("button", {
      name: EditableSectionLabels.EditButton,
    })[0];
    await waitFor(() => {
      expect(editButton).not.toBeAriaDisabled();
    });
    await userEvent.click(editButton);

    expect(
      screen.getByRole("textbox", { name: TagFormFieldsLabel.TagInput })
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("disables the edit button without an edit entitlement for the machine's pool", async () => {
    state.machine.items[0].pool = factory.modelRef({ id: 5, name: "pool-5" });
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_EDIT_MACHINES,
          resource_type: "pool",
          resource_id: 42,
        }),
      ])
    );

    renderWithProviders(<TagForm systemId="abc123" />, { state });

    await waitFor(() => {
      expect(
        screen.getAllByRole("button", {
          name: EditableSectionLabels.EditButton,
        })[0]
      ).toBeAriaDisabled();
    });
  });

  it("enables the edit button with a pool-scoped edit entitlement", async () => {
    state.machine.items[0].pool = factory.modelRef({ id: 5, name: "pool-5" });
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_EDIT_MACHINES,
          resource_type: "pool",
          resource_id: 5,
        }),
      ])
    );

    renderWithProviders(<TagForm systemId="abc123" />, { state });

    await waitFor(() => {
      expect(
        screen.getAllByRole("button", {
          name: EditableSectionLabels.EditButton,
        })[0]
      ).not.toBeAriaDisabled();
    });
  });
});
