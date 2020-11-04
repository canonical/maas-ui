import { Icon, Tooltip } from "@canonical/react-components";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import React, { useEffect } from "react";

import { SelectedAction, SetSelectedAction } from "../MachineSummary";
import { machine as machineActions } from "app/base/actions";
import ActionFormWrapper from "app/machines/components/ActionFormWrapper";
import machineSelectors from "app/store/machine/selectors";
import SectionHeader from "app/base/components/SectionHeader";
import TakeActionMenu from "app/machines/components/TakeActionMenu";
import type { RootState } from "app/store/root/types";
import type { RouteParams } from "app/base/types";

type Props = {
  selectedAction: SelectedAction | null;
  setSelectedAction: SetSelectedAction;
};

const MachineHeader = ({
  selectedAction,
  setSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams<RouteParams>();
  const loading = useSelector(machineSelectors.loading);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const statuses = useSelector((state: RootState) =>
    machineSelectors.getStatuses(state, id)
  );
  const checkingPower = statuses?.checkingPower;

  useEffect(() => {
    dispatch(machineActions.get(id));
  }, [dispatch, id]);

  if (!machine || !("devices" in machine)) {
    return <SectionHeader loading title="" />;
  }

  const { devices, fqdn, system_id } = machine;
  const urlBase = `/machine/${system_id}`;

  return (
    <SectionHeader
      buttons={
        !selectedAction
          ? [
              <TakeActionMenu
                key="action-dropdown"
                setSelectedAction={setSelectedAction}
              />,
            ]
          : null
      }
      formWrapper={
        selectedAction ? (
          <ActionFormWrapper
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
          />
        ) : null
      }
      loading={loading}
      subtitle={[
        <>
          {machine.locked ? (
            <Tooltip
              className="section__header-icon"
              message="This machine is locked. You have to unlock it to perform any actions."
              position="btm-left"
            >
              <Icon name="locked" />
            </Tooltip>
          ) : null}
          {machine.status}
        </>,
        <>
          <span className="section__header-icon">
            <Icon
              name={`power-${checkingPower ? "checking" : machine.power_state}`}
            />
          </span>
          <span data-test="machine-header-power">
            {checkingPower ? "Checking power" : `Power ${machine.power_state}`}
          </span>
        </>,
      ]}
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
          active: pathname.startsWith(`${urlBase}/commissioning`),
          component: Link,
          label: "Commissioning",
          to: `${urlBase}/commissioning`,
        },
        {
          active: pathname.startsWith(`${urlBase}/tests`),
          component: Link,
          label: "Tests",
          to: `${urlBase}/tests`,
        },
        {
          active: pathname.startsWith(`${urlBase}/logs`),
          component: Link,
          label: "Logs",
          to: `${urlBase}/logs`,
        },
        {
          active: pathname.startsWith(`${urlBase}/events`),
          component: Link,
          label: "Events",
          to: `${urlBase}/events`,
        },
        {
          active: pathname.startsWith(`${urlBase}/configuration`),
          component: Link,
          label: "Configuration",
          to: `${urlBase}/configuration`,
        },
      ]}
      title={fqdn}
    />
  );
};

export default MachineHeader;
