import { Button, Spinner } from "@canonical/react-components";
import PropTypes from "prop-types";
import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Switch } from "react-router-dom";

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

export const HeaderStrip = ({ searchFilter, setSearchFilter }) => {
  const dispatch = useDispatch();
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const selectedMachines = useSelector(machineSelectors.selected);
  const hasSelectedMachines = selectedMachines.length > 0;

  const [selectedAction, setSelectedAction] = useState();

  useEffect(() => {
    dispatch(machineActions.fetch());
  }, [dispatch]);

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
              {`${machines.length} ${pluralize(
                "machine",
                machines.length
              )} available`}
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
  setSearchFilter: PropTypes.func.isRequired,
};

export default HeaderStrip;
