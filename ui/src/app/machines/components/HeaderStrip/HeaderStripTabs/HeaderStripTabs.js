import { Col, Row } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  machine as machineActions,
  resourcepool as poolActions,
} from "app/base/actions";
import {
  machine as machineSelectors,
  resourcepool as resourcePoolSelectors,
} from "app/base/selectors";
import { useRouter } from "app/base/hooks";
import Tabs from "app/base/components/Tabs";

export const HeaderStripTabs = () => {
  const dispatch = useDispatch();
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const { location } = useRouter();

  useEffect(() => {
    dispatch(machineActions.fetch());
    dispatch(poolActions.fetch());
  }, [dispatch]);

  return (
    <Row>
      <Col size="12">
        <hr className="u-no-margin--bottom" />
        <Tabs
          data-test="machine-list-tabs"
          links={[
            {
              active: location.pathname.startsWith("/machines"),
              label: `${machinesLoaded ? `${machines.length} ` : ""}${pluralize(
                "Machine",
                machines.length
              )}`,
              path: "/machines",
            },
            {
              active: location.pathname.startsWith("/pool"),
              label: `${
                resourcePoolsLoaded ? `${resourcePools.length} ` : ""
              }${pluralize("Resource pool", resourcePools.length)}`,
              path: "/pools",
            },
          ]}
          listClassName="u-no-margin--bottom"
          noBorder
        />
      </Col>
    </Row>
  );
};

export default HeaderStripTabs;
