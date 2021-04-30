import ComposeForm from "./ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

import { useScrollOnRender } from "app/base/hooks";
import type {
  SelectedAction,
  SetSelectedAction,
} from "app/kvm/views/KVMDetails";
import { KVMAction } from "app/kvm/views/KVMDetails";
import MachineActionForms from "app/machines/components/ActionFormWrapper";

type Props = {
  selectedAction: SelectedAction;
  setSelectedAction: SetSelectedAction;
};

const getFormComponent = (
  selectedAction: SelectedAction,
  setSelectedAction: SetSelectedAction
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
    case KVMAction.COMPOSE:
      return <ComposeForm setSelectedAction={setSelectedAction} />;
    case KVMAction.DELETE:
      return <DeleteForm setSelectedAction={setSelectedAction} />;
    case KVMAction.REFRESH:
      return <RefreshForm setSelectedAction={setSelectedAction} />;
    default:
      return null;
  }
};

const KVMActionFormWrapper = ({
  selectedAction,
  setSelectedAction,
}: Props): JSX.Element | null => {
  const onRenderRef = useScrollOnRender<HTMLDivElement>();

  if (!selectedAction) {
    return null;
  }
  return (
    <div ref={onRenderRef}>
      {getFormComponent(selectedAction, setSelectedAction)}
    </div>
  );
};

export default KVMActionFormWrapper;
