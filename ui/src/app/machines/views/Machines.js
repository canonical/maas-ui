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
  const { location } = useRouter();

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
                {`${machines.length} ${pluralize(
                  "machine",
                  machines.length
                )} available`}
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
                label: `${machines.length} ${pluralize(
                  "Machine",
                  machines.length
                )}`,
                path: "/machines"
              },
              {
                active: location.pathname === "/pools",
                label: `${resourcePools.length} ${pluralize(
                  "Resource pool",
                  resourcePools.length
                )}`,
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
