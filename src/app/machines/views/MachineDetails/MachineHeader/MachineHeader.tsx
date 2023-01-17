import { useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom-v5-compat";

import MachineName from "./MachineName";

import NodeActionMenu from "app/base/components/NodeActionMenu";
import PowerIcon from "app/base/components/PowerIcon";
import ScriptStatus from "app/base/components/ScriptStatus";
import SectionHeader from "app/base/components/SectionHeader";
import TableMenu from "app/base/components/TableMenu";
import TooltipButton from "app/base/components/TooltipButton";
import { useMachineActions, useSendAnalytics } from "app/base/hooks";
import MachineHeaderForms from "app/machines/components/MachineHeaderForms";
import { MachineHeaderViews } from "app/machines/constants";
import type {
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";
import { getHeaderTitle } from "app/machines/utils";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import { useFetchMachine } from "app/store/machine/utils/hooks";
import type { RootState } from "app/store/root/types";
import { ScriptResultStatus } from "app/store/scriptresult/types";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";

type Props = {
  headerContent: MachineHeaderContent | null;
  setHeaderContent: MachineSetHeaderContent;
  systemId: Machine["system_id"];
};

const MachineHeader = ({
  headerContent,
  setHeaderContent,
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
  const powerMenuRef = useRef<HTMLSpanElement>(null);
  const powerMenuLinks = useMachineActions(systemId, [
    NodeActions.OFF,
    NodeActions.ON,
  ]);
  const isDetails = isMachineDetails(machine);
  useFetchMachine(systemId);

  if (!machine || !isDetails) {
    return <SectionHeader loading />;
  }

  const urlBase = `/machine/${systemId}`;
  const checkingPower = statuses?.checkingPower;

  return (
    <SectionHeader
      buttons={[
        <NodeActionMenu
          alwaysShowLifecycle
          excludeActions={[NodeActions.IMPORT_IMAGES]}
          filterActions
          hasSelection={true}
          key="action-dropdown"
          nodeDisplay="machine"
          nodes={[machine]}
          onActionClick={(action) => {
            sendAnalytics(
              "Machine details action form",
              getNodeActionTitle(action),
              "Open"
            );
            const view = Object.values(MachineHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setHeaderContent({ view });
            }
          }}
        />,
      ]}
      headerContent={
        headerContent ? (
          <MachineHeaderForms
            headerContent={headerContent}
            searchFilter=""
            selectedCount={1}
            selectedMachines={{ items: [machine.system_id] }}
            setHeaderContent={setHeaderContent}
            viewingDetails
          />
        ) : null
      }
      sidePanelTitle={getHeaderTitle(machine.hostname, headerContent)}
      subtitle={
        editingName ? null : (
          <div className="u-flex--wrap">
            <div className="u-nudge-left">
              {machine.locked ? (
                <TooltipButton
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
              <TableMenu
                className="u-nudge-right--small"
                links={[
                  ...(Array.isArray(powerMenuLinks)
                    ? powerMenuLinks
                    : [powerMenuLinks]),
                  {
                    children: "Check power",
                    onClick: () => {
                      dispatch(machineActions.checkPower(systemId));
                    },
                  },
                ]}
                positionNode={powerMenuRef?.current}
                title="Take action:"
              />
            </div>
          </div>
        )
      }
      subtitleLoading={!isMachineDetails(machine)}
      tabLinks={[
        {
          active: pathname.startsWith(`${urlBase}/summary`),
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
            <ScriptStatus status={machine.testing_status.status}>
              Tests
            </ScriptStatus>
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
          label: "Configuration",
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
