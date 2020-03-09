import { Button, Col, Row } from "@canonical/react-components";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { machine as machineActions } from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import ActionForm from "./ActionForm";
import DeployForm from "./DeployForm";
import SetPoolForm from "./SetPoolForm";
import SetZoneForm from "./SetZoneForm";

const getErrorSentence = (action, count) => {
  const machineString = `${count} ${pluralize("machine", count)}`;

  switch (action.name) {
    case "exit-rescue-mode":
      return `${machineString} cannot exit rescue mode`;
    case "lock":
      return `${machineString} cannot be locked`;
    case "override-failed-testing":
      return `Cannot override failed tests on ${machineString}.`;
    case "rescue-mode":
      return `${machineString} cannot be put in rescue mode`;
    case "set-pool":
      return `Cannot set pool of ${machineString}`;
    case "set-zone":
      return `Cannot set zone of ${machineString}`;
    case "unlock":
      return `${machineString} cannot be unlocked`;
    default:
      return `${machineString} cannot be ${action.sentence}`;
  }
};

export const ActionFormWrapper = ({ selectedAction, setSelectedAction }) => {
  const dispatch = useDispatch();

  const selectedMachines = useSelector(machineSelectors.selected);

  const [actionableMachines, setActionableMachines] = useState([]);
  const actionDisabled = actionableMachines.length !== selectedMachines.length;

  useLayoutEffect(() => {
    if (selectedAction) {
      const actionable = selectedMachines.filter((machine) =>
        machine.actions.includes(selectedAction.name)
      );
      setActionableMachines(actionable);
    }
  }, [selectedAction, selectedMachines]);

  useEffect(() => {
    if (selectedMachines.length === 0) {
      setSelectedAction(null);
    }
  }, [selectedMachines, setSelectedAction]);

  const getFormComponent = () => {
    if (selectedAction && selectedAction.name) {
      switch (selectedAction.name) {
        case "deploy":
          return <DeployForm setSelectedAction={setSelectedAction} />;
        case "set-pool":
          return <SetPoolForm setSelectedAction={setSelectedAction} />;
        case "set-zone":
          return <SetZoneForm setSelectedAction={setSelectedAction} />;
        default:
          return (
            <ActionForm
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
            />
          );
      }
    }
  };

  return (
    <Row>
      <hr />
      <Col size="12">
        {actionDisabled ? (
          <p data-test="machine-action-warning">
            <i className="p-icon--warning" style={{ marginRight: ".5rem" }} />
            <span>
              {getErrorSentence(
                selectedAction,
                selectedMachines.length - actionableMachines.length
              )}
              . To proceed,{" "}
              <Button
                appearance="link"
                data-test="select-actionable-machines"
                inline
                onClick={() =>
                  dispatch(machineActions.setSelected(actionableMachines))
                }
              >
                update your selection
              </Button>
              .
            </span>
          </p>
        ) : (
          getFormComponent()
        )}
      </Col>
    </Row>
  );
};

ActionFormWrapper.propTypes = {
  selectedAction: PropTypes.object,
  setSelectedAction: PropTypes.func.isRequired,
};

export default ActionFormWrapper;
