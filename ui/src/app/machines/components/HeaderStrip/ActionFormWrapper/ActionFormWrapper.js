import { Button, Col, Row } from "@canonical/react-components";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import React, { useLayoutEffect, useEffect, useState } from "react";

const getSubmitText = (action, count) => {
  const machineString = `${count} ${pluralize("machine", count)}`;

  switch (action.name) {
    case "exit-rescue-mode":
      return `Exit rescue mode for ${machineString}`;
    case "abort":
      return `Abort actions for ${machineString}`;
    case "on":
      return `Power on ${machineString}`;
    case "off":
      return `Power off ${machineString}`;
    case "mark-broken":
      return `Mark ${machineString} broken`;
    case "mark-fixed":
      return `Mark ${machineString} fixed`;
    case "override-failed-testing":
      return `Override failed tests for ${machineString}.`;
    case "rescue-mode":
      return `Enter rescue mode for ${machineString}`;
    case "set-pool":
      return `Set pool of ${machineString}`;
    case "set-zone":
      return `Set zone of ${machineString}`;
    default:
      return `${action.name.charAt(0).toUpperCase()}${action.name.slice(
        1
      )} ${machineString}`;
  }
};

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

export const ActionFormWrapper = ({
  selectedAction,
  selectedMachines,
  setSelectedAction,
  setSelectedMachines
}) => {
  const [actionableMachines, setActionableMachines] = useState([]);
  const actionDisabled = actionableMachines.length !== selectedMachines.length;

  useLayoutEffect(() => {
    if (selectedAction) {
      const actionable = selectedMachines.filter(machine =>
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

  return (
    <Row>
      <hr />
      <Col size="12">
        {actionDisabled && (
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
                onClick={() => setSelectedMachines(actionableMachines)}
              >
                update your selection
              </Button>
              .
            </span>
          </p>
        )}
        {!actionDisabled && (
          // TODO: Replace with form components for each action.
          <div className="u-align--right">
            <Button
              appearance="neutral"
              data-test="cancel-action"
              onClick={() => setSelectedAction(null)}
              style={{ marginBottom: ".4rem" }}
            >
              Cancel
            </Button>
            <Button
              appearance={
                selectedAction.name === "delete" ? "negative" : "positive"
              }
              style={{ marginBottom: ".4rem" }}
              type="submit"
            >
              {getSubmitText(selectedAction, selectedMachines.length)}
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
};

ActionFormWrapper.propTypes = {
  // TODO: PropType shapes for common props.
  // https://github.com/canonical-web-and-design/maas-ui/issues/826
  selectedAction: PropTypes.object,
  selectedMachines: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSelectedAction: PropTypes.func.isRequired,
  setSelectedMachines: PropTypes.func.isRequired
};

export default ActionFormWrapper;
