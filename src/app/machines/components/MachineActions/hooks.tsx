import {
  lazyLoadSidePanel,
  useSidePanel,
} from "@canonical/maas-react-components";
import { Button, Icon, Switch } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import type { MachineActionGroup } from "./types";

import { useGetUserEntitlements } from "@/app/api/query/auth";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import { FilterMachines } from "@/app/store/machine/utils";
import { useSelectedMachinesActionsDispatch } from "@/app/store/machine/utils/hooks";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import { canOpenActionForm } from "@/app/store/utils";
import { hasEntitlementForPool, hasPermissions } from "@/app/utils/permissions";

const CommissionForm = lazyLoadSidePanel(
  () => import("../MachineForms/MachineActionFormWrapper/CommissionForm")
);
const DeployForm = lazyLoadSidePanel(
  () => import("../MachineForms/MachineActionFormWrapper/DeployForm")
);
const ReleaseForm = lazyLoadSidePanel(
  () => import("../MachineForms/MachineActionFormWrapper/ReleaseForm")
);
const CloneForm = lazyLoadSidePanel(
  () => import("../MachineForms/MachineActionFormWrapper/CloneForm")
);
const MarkBrokenForm = lazyLoadSidePanel(
  () => import("../MachineForms/MachineActionFormWrapper/MarkBrokenForm")
);
const OverrideTestForm = lazyLoadSidePanel(
  () => import("../MachineForms/MachineActionFormWrapper/OverrideTestForm")
);
const TagForm = lazyLoadSidePanel(
  () => import("../MachineForms/MachineActionFormWrapper/TagForm")
);
const SetMachineZoneForm = lazyLoadSidePanel(
  () =>
    import("../MachineForms/MachineActionFormWrapper/SetMachineZoneForm/SetMachineZoneForm")
);
const SetPoolForm = lazyLoadSidePanel(
  () => import("../MachineForms/MachineActionFormWrapper/SetPoolForm")
);
const TestMachineForm = lazyLoadSidePanel(
  () => import("../MachineForms/MachineActionFormWrapper/TestMachineForm")
);
const DeleteMachine = lazyLoadSidePanel(
  () => import("../MachineForms/DeleteMachine/DeleteMachine")
);
const FieldlessForm = lazyLoadSidePanel(
  () => import("@/app/base/components/node/FieldlessForm")
);
const PowerOffForm = lazyLoadSidePanel(
  () => import("@/app/base/components/node/PowerOffForm")
);

export const useMachineActionMenus = (
  isViewingDetails: boolean,
  systemId?: Machine["system_id"]
) => {
  const { openSidePanel } = useSidePanel();
  const dispatch = useDispatch();

  const selectedMachines = useSelector(machineSelectors.selected);
  const searchFilter = FilterMachines.filtersToString(
    FilterMachines.queryStringToFilters(location.search)
  );

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  const { actionErrors } = useSelectedMachinesActionsDispatch({
    selectedMachines,
    searchFilter,
  });

  const actionMenus: MachineActionGroup[] = [
    {
      name: "lifecycle",
      items: [
        {
          action: NodeActions.COMMISSION,
          label: "Commission",
          onClick: () => {
            openSidePanel({
              component: CommissionForm,
              title: "Commission",
              props: {
                isViewingDetails,
              },
            });
          },
        },
        {
          action: NodeActions.ACQUIRE,
          label: "Allocate",
          onClick: () => {
            openSidePanel({
              component: FieldlessForm,
              title: "Allocate",
              props: {
                action: NodeActions.ACQUIRE,
                actions: machineActions,
                cleanup: machineActions.cleanup,
                errors: actionErrors,
                modelName: "machine",
                viewingDetails: isViewingDetails,
              },
            });
          },
        },
        {
          action: NodeActions.DEPLOY,
          label: "Deploy",
          onClick: () => {
            openSidePanel({
              component: DeployForm,
              props: {
                isViewingDetails,
              },
              title: "Deploy",
            });
          },
        },
        {
          action: NodeActions.RELEASE,
          label: "Release",
          onClick: () => {
            openSidePanel({
              component: ReleaseForm,
              props: {
                isViewingDetails,
              },
              title: "Release",
            });
          },
        },
        {
          action: NodeActions.ABORT,
          label: "Abort",
          onClick: () => {
            openSidePanel({
              component: FieldlessForm,
              title: "Abort",
              props: {
                action: NodeActions.ABORT,
                actions: machineActions,
                cleanup: machineActions.cleanup,
                errors: actionErrors,
                modelName: "machine",
                viewingDetails: isViewingDetails,
              },
            });
          },
        },
        {
          action: NodeActions.CLONE,
          label: "Clone from",
          onClick: () => {
            openSidePanel({
              component: CloneForm,
              props: {
                isViewingDetails,
              },
              title: "Clone from",
            });
          },
        },
      ],
      title: "Actions",
    },
    {
      name: "power",
      items: [
        {
          action: NodeActions.ON,
          label: "Power on",
          onClick: () => {
            openSidePanel({
              component: FieldlessForm,
              title: "Power on",
              props: {
                action: NodeActions.ON,
                actions: machineActions,
                cleanup: machineActions.cleanup,
                errors: actionErrors,
                modelName: "machine",
                viewingDetails: isViewingDetails,
              },
            });
          },
        },
        {
          action: NodeActions.OFF,
          label: "Power off",
          onClick: () => {
            openSidePanel({
              component: PowerOffForm,
              title: "Power off",
              props: {
                action: NodeActions.OFF,
                actions: machineActions,
                cleanup: machineActions.cleanup,
                errors: actionErrors,
                modelName: "machine",
                viewingDetails: isViewingDetails,
              },
            });
          },
        },
        ...(import.meta.env.VITE_APP_DPU_PROVISIONING === "true"
          ? [
              {
                action: NodeActions.POWER_CYCLE,
                label: "Power cycle",
                onClick: () => {
                  openSidePanel({
                    component: FieldlessForm,
                    title: "Power cycle",
                    props: {
                      action: NodeActions.POWER_CYCLE,
                      actions: machineActions,
                      cleanup: machineActions.cleanup,
                      errors: actionErrors,
                      modelName: "machine",
                      viewingDetails: isViewingDetails,
                    },
                  });
                },
              },
            ]
          : []),
        {
          action: NodeActions.SOFT_OFF,
          label: "Soft power off",
          onClick: () => {
            openSidePanel({
              component: PowerOffForm,
              title: "Soft power off",
              props: {
                action: NodeActions.SOFT_OFF,
                actions: machineActions,
                cleanup: machineActions.cleanup,
                errors: actionErrors,
                modelName: "machine",
                viewingDetails: isViewingDetails,
              },
            });
          },
        },
        ...(isViewingDetails && systemId
          ? [
              {
                action: NodeActions.CHECK_POWER,
                label: "Check power",
                onClick: () => dispatch(machineActions.checkPower(systemId)),
              },
            ]
          : []),
      ],
      title: "Power",
    },
    {
      name: "testing",
      items: [
        {
          action: NodeActions.TEST,
          label: "Test",
          onClick: () => {
            openSidePanel({
              component: TestMachineForm,
              props: {
                isViewingDetails,
              },
              title: "Test",
            });
          },
        },
        {
          action: NodeActions.RESCUE_MODE,
          label: "Enter rescue mode",
          onClick: () => {
            openSidePanel({
              component: FieldlessForm,
              props: {
                action: NodeActions.RESCUE_MODE,
                actions: machineActions,
                cleanup: machineActions.cleanup,
                errors: actionErrors,
                modelName: "machine",
                viewingDetails: isViewingDetails,
              },
              title: "Enter rescue mode",
            });
          },
        },
        {
          action: NodeActions.EXIT_RESCUE_MODE,
          label: "Exit rescue mode",
          onClick: () => {
            openSidePanel({
              component: FieldlessForm,
              props: {
                action: NodeActions.EXIT_RESCUE_MODE,
                actions: machineActions,
                cleanup: machineActions.cleanup,
                errors: actionErrors,
                modelName: "machine",
                viewingDetails: isViewingDetails,
              },
              title: "Exit rescue mode",
            });
          },
        },
        {
          action: NodeActions.MARK_FIXED,
          label: "Mark fixed",
          onClick: () => {
            openSidePanel({
              component: FieldlessForm,
              props: {
                action: NodeActions.MARK_FIXED,
                actions: machineActions,
                cleanup: machineActions.cleanup,
                errors: actionErrors,
                modelName: "machine",
                viewingDetails: isViewingDetails,
              },
              title: "Mark fixed",
            });
          },
        },
        {
          action: NodeActions.MARK_BROKEN,
          label: "Mark broken",
          onClick: () => {
            openSidePanel({
              component: MarkBrokenForm,
              props: {
                isViewingDetails,
              },
              title: "Mark broken",
            });
          },
        },
        {
          action: NodeActions.OVERRIDE_FAILED_TESTING,
          label: "Override failed testing",
          onClick: () => {
            openSidePanel({
              component: OverrideTestForm,
              props: {
                isViewingDetails,
              },
              title: "Override failed testing",
            });
          },
        },
      ],
      title: "Troubleshoot",
    },
    {
      name: "misc",
      items: [
        {
          action: NodeActions.TAG,
          label: "Tag",
          onClick: () => {
            openSidePanel({
              component: TagForm,
              props: {
                isViewingDetails,
              },
              title: "Tag",
            });
          },
        },
        {
          action: NodeActions.SET_ZONE,
          label: "Set zone",
          onClick: () => {
            openSidePanel({
              component: SetMachineZoneForm,
              props: {
                isViewingDetails,
              },
              title: "Set zone",
            });
          },
        },
        {
          action: NodeActions.SET_POOL,
          label: "Set pool",
          onClick: () => {
            openSidePanel({
              component: SetPoolForm,
              props: {
                isViewingDetails,
              },
              title: "Set pool",
            });
          },
        },
      ],
      title: "Categorise",
    },
    {
      name: "lock",
      items: [
        {
          action: NodeActions.LOCK,
          label: "Lock",
          onClick: () => {
            openSidePanel({
              component: FieldlessForm,
              props: {
                action: NodeActions.LOCK,
                actions: machineActions,
                cleanup: machineActions.cleanup,
                errors: actionErrors,
                modelName: "machine",
                viewingDetails: isViewingDetails,
              },
              title: "Lock",
            });
          },
        },
        {
          action: NodeActions.UNLOCK,
          label: "Unlock",
          onClick: () => {
            openSidePanel({
              component: FieldlessForm,
              props: {
                action: NodeActions.UNLOCK,
                actions: machineActions,
                cleanup: machineActions.cleanup,
                errors: actionErrors,
                modelName: "machine",
                viewingDetails: isViewingDetails,
              },
              title: "Unlock",
            });
          },
        },
      ],
      render:
        isViewingDetails && machine
          ? () => {
              if (
                canOpenActionForm(machine, NodeActions.LOCK) ||
                canOpenActionForm(machine, NodeActions.UNLOCK)
              ) {
                return (
                  <Switch
                    checked={machine.locked}
                    label="Lock"
                    onChange={() =>
                      dispatch(
                        machine.locked
                          ? machineActions.unlock({
                              system_id: machine.system_id,
                            })
                          : machineActions.lock({
                              system_id: machine.system_id,
                            })
                      )
                    }
                  />
                );
              } else {
                return <></>;
              }
            }
          : undefined,
      title: "Lock",
    },
    {
      name: "delete",
      items: [
        {
          action: NodeActions.DELETE,
          label: "Delete",
          onClick: () => {
            openSidePanel({
              component: DeleteMachine,
              props: {
                isViewingDetails,
              },
              title: "Delete",
            });
          },
        },
      ],
      render: (disabled?: boolean) => (
        <Button
          disabled={disabled}
          onClick={() => {
            openSidePanel({
              component: DeleteMachine,
              props: {
                isViewingDetails,
              },
              title: "Delete",
            });
          }}
        >
          <Icon name="delete" />
          Delete
        </Button>
      ),
      icon: "delete",
      title: "Delete",
    },
  ];

  return actionMenus;
};

/**
 * Computes the disabled state of the machine action controls, based on the
 * current user's resource-pool entitlements.
 */
export const useLifecycleActionEntitlements = (
  isViewingDetails: boolean,
  systemId?: Machine["system_id"]
): { actionsDisabled: boolean; deployDisabled: boolean } => {
  const selected = useSelector(machineSelectors.selected);
  const allMachines = useSelector(machineSelectors.all);
  const detailsMachine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { data: userEntitlements } = useGetUserEntitlements();

  // Single-machine usage that is neither the details view nor a selection is
  // left ungated.
  if (!isViewingDetails && !selected) {
    return { actionsDisabled: false, deployDisabled: false };
  }

  // Resolve the resource pool ids being acted on. Returns null when the pools
  // can't be determined (filter/group selection or unresolved machines),
  // signalling a fallback to the global entitlement check.
  const getPoolIds = (): number[] | null => {
    if (isViewingDetails) {
      return detailsMachine ? [detailsMachine.pool.id] : null;
    }
    if (!selected || "filter" in selected) {
      return null;
    }
    if ((selected.groups ?? []).length > 0) {
      return null;
    }
    const items = selected.items ?? [];
    if (items.length === 0) {
      return null;
    }
    const poolIds: number[] = [];
    for (const id of items) {
      const machine = allMachines.find((m) => m.system_id === id);
      if (!machine) {
        return null;
      }
      poolIds.push(machine.pool.id);
    }
    return Array.from(new Set(poolIds));
  };

  const poolIds = getPoolIds();

  const canEdit =
    poolIds === null
      ? hasPermissions(userEntitlements, [Entitlement.CAN_EDIT_MACHINES])
      : poolIds.every((poolId) =>
          hasEntitlementForPool(
            userEntitlements,
            Entitlement.CAN_EDIT_MACHINES,
            poolId
          )
        );

  // Per the OpenFGA model, can_deploy_machines is granted by either a deploy or
  // an edit entitlement (can_edit_machines implies deploy), scoped per pool.
  const canDeploy =
    poolIds === null
      ? hasPermissions(userEntitlements, [Entitlement.CAN_EDIT_MACHINES]) ||
        hasPermissions(userEntitlements, [Entitlement.CAN_DEPLOY_MACHINES])
      : poolIds.every(
          (poolId) =>
            hasEntitlementForPool(
              userEntitlements,
              Entitlement.CAN_EDIT_MACHINES,
              poolId
            ) ||
            hasEntitlementForPool(
              userEntitlements,
              Entitlement.CAN_DEPLOY_MACHINES,
              poolId
            )
        );

  return { actionsDisabled: !canEdit, deployDisabled: !canDeploy };
};
