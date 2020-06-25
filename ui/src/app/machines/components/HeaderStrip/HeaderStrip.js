import { Button, Spinner } from "@canonical/react-components";
import PropTypes from "prop-types";
import pluralize from "pluralize";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Switch, useLocation } from "react-router-dom";

import {
  filtersToString,
  getCurrentFilters,
  toggleFilter,
} from "app/machines/search";
import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import ActionFormWrapper from "./ActionFormWrapper";
import AddHardwareMenu from "./AddHardwareMenu";
import HeaderStripTabs from "./HeaderStripTabs";
import TakeActionMenu from "./TakeActionMenu";

const getMachineCount = (machines, selectedMachines, setSearchFilter) => {
  const machineCountString = `${machines.length} ${pluralize(
    "machine",
    machines.length
  )}`;
  if (selectedMachines.length) {
    if (machines.length === selectedMachines.length) {
      return "All machines selected";
    }
    return (
      <Button
        className="p-button--link"
        onClick={() => setSearchFilter("in:(Selected)")}
      >
        {`${selectedMachines.length} of ${machineCountString} selected`}
      </Button>
    );
  }
  return `${machineCountString} available`;
};

export const HeaderStrip = ({
  searchFilter,
  selectedAction,
  setSearchFilter,
  setSelectedAction,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const selectedMachines = useSelector(machineSelectors.selected);
  const hasSelectedMachines = selectedMachines.length > 0;

  useEffect(() => {
    dispatch(machineActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname !== "/machines") {
      setSelectedAction(null);
    }
  }, [location.pathname, setSelectedAction]);

  const setAction = (action, deselect) => {
    if (action || deselect) {
      const filters = getCurrentFilters(searchFilter);
      const newFilters = toggleFilter(
        filters,
        "in",
        "selected",
        false,
        !deselect
      );
      setSearchFilter(filtersToString(newFilters));
    }
    setSelectedAction(action);
  };

  return (
    <>
      <div className="u-flex--between u-flex--wrap">
        <ul className="p-inline-list">
          <li className="p-inline-list__item p-heading--four">Machines</li>
          {machinesLoaded ? (
            <li
              className="p-inline-list__item last-item u-text--light"
              data-test="machine-count"
            >
              {getMachineCount(machines, selectedMachines, setSearchFilter)}
            </li>
          ) : (
            <Spinner
              className="u-no-padding u-no-margin"
              inline
              text="Loading..."
            />
          )}
        </ul>
        <Switch>
          <Route exact path="/machines">
            <ul className="p-inline-list u-no-margin--bottom">
              {!selectedAction && (
                <>
                  <li className="p-inline-list__item">
                    <AddHardwareMenu disabled={hasSelectedMachines} />
                  </li>
                  <li className="p-inline-list__item last-item">
                    <TakeActionMenu setSelectedAction={setAction} />
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
      </div>
      {selectedAction && (
        <ActionFormWrapper
          selectedAction={selectedAction}
          setSelectedAction={setAction}
        />
      )}
      <HeaderStripTabs />
    </>
  );
};

HeaderStrip.propTypes = {
  searchFilter: PropTypes.string,
  selectedAction: PropTypes.object,
  setSearchFilter: PropTypes.func.isRequired,
  setSelectedAction: PropTypes.func.isRequired,
};

export default HeaderStrip;
