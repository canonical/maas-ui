import { Button, Col, Loader, Row } from "@canonical/react-components";
import PropTypes from "prop-types";
import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Switch } from "react-router-dom";

import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import ActionFormWrapper from "./ActionFormWrapper";
import AddHardwareMenu from "./AddHardwareMenu";
import HeaderStripTabs from "./HeaderStripTabs";
import TakeActionMenu from "./TakeActionMenu";

export const HeaderStrip = () => {
  const dispatch = useDispatch();
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const selectedMachines = useSelector(machineSelectors.selected);
  const hasSelectedMachines = selectedMachines.length > 0;

  const [selectedAction, setSelectedAction] = useState();

  useEffect(() => {
    dispatch(machineActions.fetch());
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
                    <span>{`${selectedMachines.length} selected`}</span>
                    <span className="p-heading--four" />
                  </li>
                )}
                {!selectedAction && (
                  <>
                    <li className="p-inline-list__item">
                      <AddHardwareMenu disabled={hasSelectedMachines} />
                    </li>
                    <li className="p-inline-list__item last-item">
                      <TakeActionMenu setSelectedAction={setSelectedAction} />
                    </li>
                  </>
                )}
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
      {selectedAction && (
        <ActionFormWrapper
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
        />
      )}
      <HeaderStripTabs />
    </>
  );
};

HeaderStrip.propTypes = {
  disabled: PropTypes.bool,
};

export default HeaderStrip;
