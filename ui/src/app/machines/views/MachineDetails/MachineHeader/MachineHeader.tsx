import { useEffect, useRef, useState } from "react";

import { Icon, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import MachineName from "./MachineName";

import PowerIcon from "app/base/components/PowerIcon";
import ScriptStatus from "app/base/components/ScriptStatus";
import SectionHeader from "app/base/components/SectionHeader";
import TableMenu from "app/base/components/TableMenu";
import { useMachineActions } from "app/base/hooks";
import ActionFormWrapper from "app/machines/components/ActionFormWrapper";
import TakeActionMenu from "app/machines/components/TakeActionMenu";
import type {
  MachineHeaderContent,
  MachineSetHeaderContent,
} from "app/machines/types";
import { getActionTitle } from "app/machines/utils";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

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

  useEffect(() => {
    dispatch(machineActions.get(systemId));
  }, [dispatch, systemId]);

  if (!isMachineDetails(machine)) {
    return <SectionHeader loading title="" />;
  }

  const { devices } = machine;
  const urlBase = `/machine/${systemId}`;
  const checkingPower = statuses?.checkingPower;

  return (
    <SectionHeader
      buttons={[
        <TakeActionMenu
          key="action-dropdown"
          setHeaderContent={setHeaderContent}
        />,
      ]}
      headerContent={
        headerContent ? (
          <ActionFormWrapper
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
          />
        ) : null
      }
      loading={!machine}
      subtitle={
        editingName
          ? null
          : [
              <>
                {machine.locked ? (
                  <Tooltip
                    className="u-nudge-left--small"
                    message="This machine is locked. You have to unlock it to perform any actions."
                    position="btm-left"
                  >
                    <Icon name="locked" />
                  </Tooltip>
                ) : null}
                {machine.status}
              </>,
              <>
                <span className="u-nudge-left--small">
                  <PowerIcon
                    data-test="machine-header-power"
                    powerState={machine.power_state}
                    showSpinner={checkingPower}
                  >
                    {checkingPower
                      ? "Checking power"
                      : `Power ${machine.power_state}`}
                  </PowerIcon>
                </span>
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
              </>,
            ]
      }
      tabLinks={[
        {
          active: pathname.startsWith(`${urlBase}/summary`),
          component: Link,
          label: "Summary",
          to: `${urlBase}/summary`,
        },
        ...(devices?.length >= 1
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
            <ScriptStatus status={machine.installation_status}>
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
        headerContent ? (
          getActionTitle(headerContent.name)
        ) : (
          <MachineName
            editingName={editingName}
            id={systemId}
            setEditingName={setEditingName}
          />
        )
      }
    />
  );
};

export default MachineHeader;
