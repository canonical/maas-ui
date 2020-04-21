import { Loader } from "@canonical/react-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

import {
  general as generalSelectors,
  machine as machineSelectors,
} from "app/base/selectors";

const useProcessingState = (savedState, setProcessing, setSelectedAction) => {
  const previousSavedState = useRef(savedState);
  useEffect(() => {
    if (savedState && !previousSavedState.current) {
      setProcessing(false);
      setSelectedAction(null);
    }
    if (previousSavedState.current !== savedState) {
      previousSavedState.current = savedState;
    }
  }, [savedState, setProcessing, setSelectedAction]);
};

const MachinesProcessing = ({
  action,
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

  useProcessingState(
    selectedSavingCount === 0,
    setProcessing,
    setSelectedAction
  );

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
  machinesProcessing: PropTypes.array.isRequired,
  setProcessing: PropTypes.func.isRequired,
  setSelectedAction: PropTypes.func.isRequired,
};

export default MachinesProcessing;
