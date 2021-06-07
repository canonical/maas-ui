import { useCallback } from "react";

import ComposeForm from "./ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

import { useScrollOnRender } from "app/base/hooks";
import type { ClearSelectedAction } from "app/base/types";
import type {
  KVMSelectedAction,
  KVMSetSelectedAction,
} from "app/kvm/views/KVMDetails/KVMDetails";
import MachineActionForms from "app/machines/components/ActionFormWrapper";
import { PodAction } from "app/store/pod/types";

type Props = {
  selectedAction: KVMSelectedAction | null;
  setSelectedAction: KVMSetSelectedAction;
};

const getFormComponent = (
  selectedAction: KVMSelectedAction,
  setSelectedAction: KVMSetSelectedAction,
  clearSelectedAction: ClearSelectedAction
) => {
  if (
    selectedAction &&
    typeof selectedAction === "object" &&
    "name" in selectedAction
  ) {
    return (
      <MachineActionForms
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
      />
    );
  }

  switch (selectedAction) {
    case PodAction.COMPOSE:
      return <ComposeForm clearSelectedAction={clearSelectedAction} />;
    case PodAction.DELETE:
      return <DeleteForm clearSelectedAction={clearSelectedAction} />;
    case PodAction.REFRESH:
      return <RefreshForm clearSelectedAction={clearSelectedAction} />;
    default:
      return null;
  }
};

const KVMActionFormWrapper = ({
  selectedAction,
  setSelectedAction,
}: Props): JSX.Element | null => {
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const clearSelectedAction = useCallback(
    () => setSelectedAction(null),
    [setSelectedAction]
  );

  if (!selectedAction) {
    return null;
  }
  return (
    <div ref={onRenderRef}>
      {getFormComponent(selectedAction, setSelectedAction, clearSelectedAction)}
    </div>
  );
};

export default KVMActionFormWrapper;
