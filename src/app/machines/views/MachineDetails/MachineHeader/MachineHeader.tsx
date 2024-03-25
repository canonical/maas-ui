import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import MachineName from "./MachineName";

import NodeActionMenu from "@/app/base/components/NodeActionMenu";
import NodeActionMenuGroup from "@/app/base/components/NodeActionMenuGroup";
import PowerIcon from "@/app/base/components/PowerIcon";
import ScriptStatus from "@/app/base/components/ScriptStatus";
import SectionHeader from "@/app/base/components/SectionHeader";
import TooltipButton from "@/app/base/components/TooltipButton";
import { useSendAnalytics } from "@/app/base/hooks";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { MachineSetSidePanelContent } from "@/app/machines/types";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import { isMachineDetails } from "@/app/store/machine/utils";
import { isUnconfiguredPowerType } from "@/app/store/machine/utils/common";
import {
  useFetchMachine,
  useSelectedMachinesActionsDispatch,
} from "@/app/store/machine/utils/hooks";
import type { RootState } from "@/app/store/root/types";
import { ScriptResultStatus } from "@/app/store/scriptresult/types";
import { NodeActions } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";

type Props = {
  setSidePanelContent: MachineSetSidePanelContent;
  systemId: Machine["system_id"];
};

const MachineHeader = ({
  setSidePanelContent,
  systemId,
}: Props): JSX.Element => {
  const [editingName, setEditingName] = useState(false);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const sendAnalytics = useSendAnalytics();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const statuses = useSelector((state: RootState) =>
    machineSelectors.getStatuses(state, systemId)
  );
  const { dispatch: dispatchForSelectedMachines } =
    useSelectedMachinesActionsDispatch({
      selectedMachines: { items: [systemId] },
    });
  const isDetails = isMachineDetails(machine);
  useFetchMachine(systemId);

  const handleActionClick = (action: NodeActions) => {
    sendAnalytics(
      "Machine details action form",
      getNodeActionTitle(action),
      "Open"
    );

    const isImmediateAction =
      action === NodeActions.LOCK || action === NodeActions.UNLOCK;

    if (isImmediateAction) {
      dispatchForSelectedMachines(machineActions[action]);
    } else if (action === NodeActions.CHECK_POWER) {
      dispatch(machineActions.checkPower(systemId));
    } else {
      const view = Object.values(MachineSidePanelViews).find(
        ([, actionName]) => actionName === action
      );
      if (view) {
        setSidePanelContent({ view });
      }
    }
  };

  if (!machine || !isDetails) {
    return <SectionHeader loading />;
  }

  const urlBase = `/machine/${systemId}`;
  const checkingPower = statuses?.checkingPower;
  const needsPowerConfiguration = isUnconfiguredPowerType(machine);

  return (
    <SectionHeader
      renderButtons={() => (
        <div>
          <div className="u-hide--medium u-hide--small u-nudge-right">
            <NodeActionMenuGroup
              alwaysShowLifecycle
              excludeActions={[NodeActions.IMPORT_IMAGES]}
              filterActions
              hasSelection={true}
              isNodeLocked={machine.locked}
              nodeDisplay="machine"
              nodes={[machine]}
              onActionClick={handleActionClick}
              singleNode
            />
          </div>
          <div className="u-hide--large u-nudge-right">
            <NodeActionMenu
              alwaysShowLifecycle
              className="u-hide--large"
              excludeActions={[NodeActions.IMPORT_IMAGES]}
              filterActions
              hasSelection={true}
              key="action-dropdown"
              nodeDisplay="machine"
              nodes={[machine]}
              onActionClick={handleActionClick}
              toggleAppearance=""
              toggleClassName="p-action-menu u-no-margin--bottom"
              toggleLabel="Menu"
            />
          </div>
        </div>
      )}
      subtitle={
        editingName ? null : (
          <div className="u-flex--wrap u-flex--align-center">
            <div className="u-nudge-left">
              {machine.locked ? (
                <TooltipButton
                  aria-label="locked"
                  className="u-nudge-left--small"
                  iconName="locked"
                  message="This machine is locked. You have to unlock it to perform any actions."
                  position="btm-left"
                />
              ) : null}
              {machine.status}
            </div>
            <div>
              <PowerIcon
                data-testid="machine-header-power"
                powerState={machine.power_state}
                showSpinner={checkingPower}
              >
                {checkingPower
                  ? "Checking power"
                  : `Power ${machine.power_state}`}
              </PowerIcon>
            </div>
          </div>
        )
      }
      subtitleLoading={!isMachineDetails(machine)}
      tabLinks={[
        {
          component: Link,
          label: "Summary",
          to: `${urlBase}/summary`,
        },
        ...(isDetails && machine.devices?.length >= 1
          ? [
              {
                active: pathname.startsWith(`${urlBase}/instances`),
                component: Link,
                label: "Instances",
                to: `${urlBase}/instances`,
              },
            ]
          : []),
        {
          active: pathname.startsWith(`${urlBase}/network`),
          component: Link,
          label: "Network",
          to: `${urlBase}/network`,
        },
        {
          active: pathname.startsWith(`${urlBase}/storage`),
          component: Link,
          label: "Storage",
          to: `${urlBase}/storage`,
        },
        {
          active: pathname.startsWith(`${urlBase}/pci-devices`),
          component: Link,
          label: "PCI devices",
          to: `${urlBase}/pci-devices`,
        },
        {
          active: pathname.startsWith(`${urlBase}/usb-devices`),
          component: Link,
          label: "USB",
          to: `${urlBase}/usb-devices`,
        },
        {
          active: pathname.startsWith(`${urlBase}/commissioning`),
          component: Link,
          label: (
            <ScriptStatus status={machine.commissioning_status.status}>
              Commissioning
            </ScriptStatus>
          ),
          to: `${urlBase}/commissioning`,
        },
        {
          active: pathname.startsWith(`${urlBase}/testing`),
          component: Link,
          label: (
            <ScriptStatus status={machine.testing_status}>Tests</ScriptStatus>
          ),
          to: `${urlBase}/testing`,
        },
        {
          active: pathname.startsWith(`${urlBase}/logs`),
          component: Link,
          label: (
            <ScriptStatus
              status={
                isDetails
                  ? machine.installation_status
                  : ScriptResultStatus.NONE
              }
            >
              Logs
            </ScriptStatus>
          ),
          to: `${urlBase}/logs`,
        },
        {
          active: pathname.startsWith(`${urlBase}/configuration`),
          component: Link,
          label: (
            <ScriptStatus
              status={
                needsPowerConfiguration
                  ? ScriptResultStatus.FAILED
                  : ScriptResultStatus.NONE
              }
            >
              Configuration
            </ScriptStatus>
          ),
          to: `${urlBase}/configuration`,
        },
      ]}
      title={
        <MachineName
          editingName={editingName}
          id={systemId}
          setEditingName={setEditingName}
        />
      }
      titleElement={editingName ? "div" : "h1"}
    />
  );
};

export default MachineHeader;
