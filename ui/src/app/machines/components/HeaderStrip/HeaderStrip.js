import { Button, Col, Loader, Row } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Switch } from "react-router-dom";

import {
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

export const HeaderStrip = () => {
  const dispatch = useDispatch();
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const navigationOptions = useSelector(generalSelectors.navigationOptions.get);
  const { location } = useRouter();

  useEffect(() => {
    dispatch(poolActions.fetch());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  return (
    <>
      <Row>
        <Col size="10">
          <ul className="p-inline-list">
            <li className="p-inline-list__item p-heading--four">Machines</li>
            {machinesLoaded ? (
              <li
                className="p-inline-list__item u-text--light"
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
        <Col size="2" className="u-align--right">
          <Switch>
            <Route exact path="/machines">
              <ContextualMenu
                data-test="add-hardware-dropdown"
                hasToggleIcon
                links={getAddHardwareLinks(navigationOptions)}
                position="right"
                toggleAppearance="neutral"
                toggleLabel="Add hardware"
              />
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
