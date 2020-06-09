import { useEffect, useRef } from "react";

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

export const useMachinesProcessing = (
  machinesProcessing,
  setProcessing,
  setSelectedAction,
  hasErrors = false
) => {
  const processingStarted = useRef(false);
  const selectedSavingCount = machinesProcessing.length;
  if (processingStarted.current === false && selectedSavingCount > 0) {
    processingStarted.current = true;
  }

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
};
