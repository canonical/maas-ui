import React from "react";

import ComposeForm from "app/kvm/components/KVMActionFormWrapper/ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

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
