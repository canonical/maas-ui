import React from "react";

import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

type Props = {
  selectedAction: string;
  setSelectedAction: (action: string) => void;
};

const KVMActionFormWrapper = ({
  selectedAction,
  setSelectedAction,
}: Props): JSX.Element => {
  if (!selectedAction) {
    return null;
  }
  return (
    <>
      {selectedAction === "delete" && (
        <DeleteForm setSelectedAction={setSelectedAction} />
      )}
      {selectedAction === "refresh" && (
        <RefreshForm setSelectedAction={setSelectedAction} />
      )}
    </>
  );
};

export default KVMActionFormWrapper;
