import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import type { RouteParams } from "app/base/types";
import type { MachineDetails } from "app/store/machine/types";
import { machine as machineActions } from "app/base/actions";
import machineSelectors from "app/store/machine/selectors";
import ActionFormWrapper from "app/machines/components/ActionFormWrapper";
import SectionHeader from "app/base/components/SectionHeader";
import TakeActionMenu from "app/machines/components/TakeActionMenu";
import type { MachineAction } from "app/store/general/types";
import type { RootState } from "app/store/root/types";

type Props = {
  selectedAction: MachineAction | null;
  setSelectedAction: (action: MachineAction | null, deselect?: boolean) => void;
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
  ) as MachineDetails;

  useEffect(() => {
    dispatch(machineActions.get(id));
  }, [dispatch, id]);

  if (!!machine) {
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
        subtitle={machine.status}
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
  }
  return <SectionHeader loading title="" />;
};

export default MachineHeader;
