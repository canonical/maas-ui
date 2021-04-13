import ComposeForm from "./ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

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

const KVMActionFormWrapper = ({
  selectedAction,
  setSelectedAction,
}: Props): JSX.Element | null => {
  if (!selectedAction) {
    return null;
  }
  if (typeof selectedAction === "object" && "name" in selectedAction) {
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

export default KVMActionFormWrapper;
