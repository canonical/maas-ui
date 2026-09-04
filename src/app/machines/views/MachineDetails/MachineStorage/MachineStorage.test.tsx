import { storageLayoutOptions } from "./ChangeStorageLayoutMenu/ChangeStorageLayoutMenu";
import MachineStorage from "./MachineStorage";

import * as hooks from "@/app/base/hooks/analytics";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { MIN_PARTITION_SIZE } from "@/app/store/machine/constants";
import { DiskTypes } from "@/app/store/types/enum";
import { NodeStatusCode } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

const getEditableMachineState = () => {
  const disk = factory.nodeDisk({
    available_size: MIN_PARTITION_SIZE + 1,
    filesystem: null,
    name: "available-disk",
    type: DiskTypes.PHYSICAL,
  });
  return factory.rootState({
    general: factory.generalState({
      powerTypes: factory.powerTypesState({
        data: [factory.powerType()],
      }),
    }),
    machine: factory.machineState({
      items: [
        factory.machineDetails({
          disks: [disk],
          locked: false,
          permissions: ["edit"],
          pool: factory.modelRef({ id: 5, name: "pool-5" }),
          status_code: NodeStatusCode.READY,
          system_id: "abc123",
        }),
      ],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
      }),
    }),
  });
};

it("displays a spinner if machine is loading", () => {
  const state = factory.rootState({
    machine: factory.machineState({
      items: [],
    }),
  });
  renderWithProviders(<MachineStorage />, {
    state,
    initialEntries: ["/machine/abc123"],
  });
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
});

it("renders storage layout dropdown if machine's storage can be edited", async () => {
  const state = factory.rootState({
    general: factory.generalState({
      powerTypes: factory.powerTypesState({
        data: [factory.powerType()],
      }),
    }),
    machine: factory.machineState({
      items: [
        factory.machineDetails({
          locked: false,
          permissions: ["edit"],
          status_code: NodeStatusCode.READY,
          system_id: "abc123",
        }),
      ],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
      }),
    }),
  });
  renderWithProviders(<MachineStorage />, {
    state,
    initialEntries: ["/machine/abc123/storage"],
    pattern: "/machine/:id/storage",
  });
  expect(
    screen.getByRole("button", { name: "Change storage layout" })
  ).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "Change storage layout" })
  );
  expect(screen.getByLabelText("sub")).toBeInTheDocument();
  storageLayoutOptions.forEach((group) => {
    group.forEach((option) => {
      expect(
        screen.getByRole("menuitem", { name: option.label })
      ).toBeInTheDocument();
    });
  });
});

it("sends an analytics event when clicking on the MAAS docs footer link", async () => {
  const state = factory.rootState({
    machine: factory.machineState({
      items: [factory.machineDetails({ system_id: "abc123" })],
      loaded: true,
    }),
  });
  const mockSendAnalytics = vi.fn();
  const mockUseSendAnalytics = vi
    .spyOn(hooks, "useSendAnalytics")
    .mockImplementation(() => mockSendAnalytics);
  renderWithProviders(<MachineStorage />, {
    state,
    initialEntries: ["/machine/abc123/storage"],
    pattern: "/machine/:id/storage",
  });
  await userEvent.click(screen.getByTestId("docs-footer-link"));
  expect(mockSendAnalytics).toHaveBeenCalled();
  expect(mockSendAnalytics.mock.calls[0]).toEqual([
    "Machine storage",
    "Click link to MAAS docs",
    "Windows",
  ]);
  mockUseSendAnalytics.mockRestore();
});

it("disables the storage table actions without an edit entitlement for the machine's pool", async () => {
  const state = getEditableMachineState();
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({
        entitlement: Entitlement.CAN_EDIT_MACHINES,
        resource_type: "pool",
        resource_id: 42,
      }),
    ])
  );

  renderWithProviders(<MachineStorage />, {
    state,
    initialEntries: ["/machine/abc123/storage"],
    pattern: "/machine/:id/storage",
  });

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /Take action/ })
    ).toBeAriaDisabled();
  });
});

it("enables the storage table actions with a pool-scoped edit entitlement", async () => {
  const state = getEditableMachineState();
  mockServer.use(
    authResolvers.getMeEntitlements.handler([
      factory.entitlement({
        entitlement: Entitlement.CAN_EDIT_MACHINES,
        resource_type: "pool",
        resource_id: 5,
      }),
    ])
  );

  renderWithProviders(<MachineStorage />, {
    state,
    initialEntries: ["/machine/abc123/storage"],
    pattern: "/machine/:id/storage",
  });

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /Take action/ })
    ).not.toBeAriaDisabled();
  });
});
