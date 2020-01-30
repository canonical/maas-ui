import { Loader } from "@canonical/react-components";
import pluralize from "pluralize";
import React from "react";
import { useSelector } from "react-redux";

import { machine as machineSelectors } from "app/base/selectors";
import Routes from "app/machines/components/Routes";
import Section from "app/base/components/Section";

const Machines = () => {
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);

  return (
    <Section
      title={
        <ul className="p-inline-list u-no-margin--bottom">
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
      }
    >
      <Routes />
    </Section>
  );
};

export default Machines;
