import React from "react";

import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

import ComposeForm from "app/kvm/components/KVMActionFormWrapper/ComposeForm";

type Props = {
  selectedAction: string;
  setSelectedAction: (action: string | null) => void;
};

const RSDActionFormWrapper = ({
  selectedAction,
  setSelectedAction,
}: Props): JSX.Element | null => {
  if (!selectedAction) {
    return null;
  }
  return (
    <>
      {selectedAction === "compose" && (
        <ComposeForm setSelectedAction={setSelectedAction} />
      )}
      {selectedAction === "delete" && (
        <DeleteForm setSelectedAction={setSelectedAction} />
      )}
      {selectedAction === "refresh" && (
        <RefreshForm setSelectedAction={setSelectedAction} />
      )}
    </>
  );
};

export default RSDActionFormWrapper;
