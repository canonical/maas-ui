import { Button, Col, Loader, Row } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Switch } from "react-router-dom";

import {
  general as generalActions,
  machine as machineActions,
  resourcepool as poolActions
} from "app/base/actions";
import {
  general as generalSelectors,
  machine as machineSelectors,
  resourcepool as resourcePoolSelectors
} from "app/base/selectors";
import { useRouter } from "app/base/hooks";
import ContextualMenu from "app/base/components/ContextualMenu";
import Tabs from "app/base/components/Tabs";
import Tooltip from "app/base/components/Tooltip";

const getAddHardwareLinks = navigationOptions => {
  const links = [
    {
      children: "Machine",
      element: Link,
      to: "/machines/add"
    },
    {
      children: "Chassis",
      element: Link,
      to: "/machines/chassis/add"
    }
  ];

  return navigationOptions.rsd
    ? links.concat({
        children: "RSD",
        element: "a",
        href: `${process.env.REACT_APP_ANGULAR_BASENAME}/rsd`
      })
    : links;
};

const getTakeActionLinks = (actionOptions, machines) => {
  const initGroups = [
    { type: "lifecycle", items: [] },
    { type: "power", items: [] },
    { type: "testing", items: [] },
    { type: "lock", items: [] },
    { type: "misc", items: [] }
  ];

  const groupedLinks = actionOptions.reduce((groups, option) => {
    const count = machines.reduce((sum, machine) => {
      if (machine.actions.includes(option.name)) {
        sum += 1;
      }
      return sum;
    }, 0);

    if (count > 0 || option.type === "lifecycle") {
      const group = groups.find(group => group.type === option.type);
      group.items.push({
        children: (
          <div className="u-flex-between">
            <span data-test={`action-title-${option.name}`}>
              {option.title}
            </span>
            {machines.length > 1 && (
              <span
                data-test={`action-count-${option.name}`}
                style={{ marginLeft: ".5rem" }}
              >
                {count || ""}
              </span>
            )}
          </div>
        ),
        disabled: count === 0,
        onClick: () => null
      });
    }
    return groups;
  }, initGroups);

  return groupedLinks.map(group => group.items);
};

export const HeaderStrip = ({ selectedMachines }) => {
  const dispatch = useDispatch();
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const actionOptions = useSelector(generalSelectors.machineActions.get);
  const navigationOptions = useSelector(generalSelectors.navigationOptions.get);
  const { location } = useRouter();

  useEffect(() => {
    dispatch(generalActions.fetchMachineActions());
    dispatch(machineActions.fetch());
    dispatch(poolActions.fetch());
  }, [dispatch]);

  return (
    <>
      <Row>
        <Col size="6">
          <ul className="p-inline-list">
            <li className="p-inline-list__item p-heading--four">Machines</li>
            {machinesLoaded ? (
              <li
                className="p-inline-list__item last-item u-text--light"
                data-test="machine-count"
              >
                {`${machines.length} ${pluralize(
                  "machine",
                  machines.length
                )} available`}
              </li>
            ) : (
              <Loader
                className="u-no-padding u-no-margin"
                inline
                text="Loading..."
              />
            )}
          </ul>
        </Col>
        <Col size="6" className="u-align--right">
          <Switch>
            <Route exact path="/machines">
              <ul className="p-inline-list u-no-margin--bottom">
                {selectedMachines.length > 0 && (
                  <li
                    className="p-inline-list__item u-text--light"
                    data-test="selected-count"
                  >
                    {`${selectedMachines.length} selected`}
                  </li>
                )}
                <li className="p-inline-list__item">
                  <ContextualMenu
                    data-test="add-hardware-dropdown"
                    hasToggleIcon
                    links={getAddHardwareLinks(navigationOptions)}
                    position="right"
                    toggleAppearance="neutral"
                    toggleLabel="Add hardware"
                  />
                </li>
                <li className="p-inline-list__item last-item">
                  <Tooltip
                    message={
                      !selectedMachines.length &&
                      "Select machines below to perform an action."
                    }
                    position="left"
                  >
                    <ContextualMenu
                      data-test="take-action-dropdown"
                      hasToggleIcon
                      links={getTakeActionLinks(
                        actionOptions,
                        selectedMachines
                      )}
                      position="right"
                      toggleAppearance="positive"
                      toggleDisabled={!selectedMachines.length}
                      toggleLabel="Take action"
                    />
                  </Tooltip>
                </li>
              </ul>
            </Route>
            <Route exact path="/pools">
              <Button data-test="add-pool" element={Link} to="/pools/add">
                Add pool
              </Button>
            </Route>
          </Switch>
        </Col>
      </Row>
      <Row>
        <Col size="12">
          <hr className="u-no-margin--bottom" />
          <Tabs
            data-test="machine-list-tabs"
            links={[
              {
                active: location.pathname.startsWith("/machines"),
                label: `${
                  machinesLoaded ? `${machines.length} ` : ""
                }${pluralize("Machine", machines.length)}`,
                path: "/machines"
              },
              {
                active: location.pathname.startsWith("/pool"),
                label: `${
                  resourcePoolsLoaded ? `${resourcePools.length} ` : ""
                }${pluralize("Resource pool", resourcePools.length)}`,
                path: "/pools"
              }
            ]}
            listClassName="u-no-margin--bottom"
            noBorder
          />
        </Col>
      </Row>
    </>
  );
};

export default HeaderStrip;
