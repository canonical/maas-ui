import { Loader } from "@canonical/react-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

import {
  general as generalSelectors,
  machine as machineSelectors,
} from "app/base/selectors";

// Handle checking when a value has cycled from false to true.
const useCycled = (newState, onCycled) => {
  const previousState = useRef(newState);
  useEffect(() => {
    if (newState && !previousState.current) {
      onCycled();
    }
    if (previousState.current !== newState) {
      previousState.current = newState;
    }
  }, [newState, onCycled]);
};

const MachinesProcessing = ({
  action,
  hasErrors = false,
  machinesProcessing,
  setProcessing,
  setSelectedAction,
}) => {
  const processingStarted = useRef(false);
  const selectedMachines = useSelector(machineSelectors.selected);
  const selectedMachinesCount = selectedMachines.length;
  const { sentence } = useSelector((state) =>
    generalSelectors.machineActions.getByName(state, action)
  );
  const selectedSavingCount = machinesProcessing.length;
  if (processingStarted.current === false && selectedSavingCount > 0) {
    processingStarted.current = true;
  }
  const processedCount = processingStarted.current
    ? selectedMachinesCount - selectedSavingCount
    : 0;

  // If all the machines have finished processing then update the state.
  useCycled(selectedSavingCount === 0, () => {
    if (!hasErrors) {
      setProcessing(false);
      setSelectedAction(null);
    }
  });

  // If the machines are processing and there are errors then exit the
  // processing state.
  useCycled(hasErrors, () => {
    if (processingStarted) {
      setProcessing(false);
    }
  });

  return (
    <p>
      <Loader inline className="u-no-margin" />
      {processedCount} of {selectedMachinesCount} nodes are transitioning to{" "}
      {sentence.toLowerCase()}.
    </p>
  );
};

MachinesProcessing.propTypes = {
  action: PropTypes.string.isRequired,
  hasErrors: PropTypes.bool,
  machinesProcessing: PropTypes.array.isRequired,
  setProcessing: PropTypes.func.isRequired,
  setSelectedAction: PropTypes.func.isRequired,
};

export default MachinesProcessing;
