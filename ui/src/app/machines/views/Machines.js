import { Loader } from "@canonical/react-components";
import pluralize from "pluralize";
import React from "react";
import { useSelector } from "react-redux";

import { useRouter } from "app/base/hooks";
import {
  machine as machineSelectors,
  resourcepool as resourcePoolSelectors
} from "app/base/selectors";
import Routes from "app/machines/components/Routes";
import Section from "app/base/components/Section";
import Tabs from "app/base/components/Tabs";

const Machines = () => {
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const { location } = useRouter();
  const { location } = useRouter();

  const machineString = `${machines.length} ${pluralize(
    "machine",
    machines.length
  )}`;
  const poolString = `${resourcePools.length} ${pluralize(
    "resource pool",
    resourcePools.length
  )}`;

  return (
    <Section
      headerClassName="u-no-padding--bottom"
      title={
        <>
          <ul className="p-inline-list">
            <li className="p-inline-list__item p-heading--four">Machines</li>
            {machinesLoaded ? (
              <li
                className="p-inline-list__item u-text--light"
                data-test="machine-count"
              >
                {`${machineString} available`}
              </li>
            ) : (
              <Loader inline text="Loading..." />
            )}
          </ul>
          <hr className="u-no-margin--bottom" />
          <Tabs
            data-test="machine-list-tabs"
            links={[
              {
                active: location.pathname === "/machines",
                label: machineString,
                path: "/machines"
              },
              {
                active: location.pathname === "/pools",
                label: poolString,
                path: "/pools"
              }
            ]}
            listClassName="u-no-margin--bottom"
            noBorder
          />
        </>
      }
    >
      <Routes />
    </Section>
  );
};

export default Machines;
