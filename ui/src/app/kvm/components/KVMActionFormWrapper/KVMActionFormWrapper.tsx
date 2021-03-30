import ComposeForm from "./ComposeForm";
import DeleteForm from "./DeleteForm";
import RefreshForm from "./RefreshForm";

import type {
  SelectedAction,
  SetSelectedAction,
} from "app/kvm/views/KVMDetails";
import { KVMAction } from "app/kvm/views/KVMDetails";

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
  return (
    <>
      {selectedAction === KVMAction.COMPOSE && (
        <ComposeForm setSelectedAction={setSelectedAction} />
      )}
      {selectedAction === KVMAction.DELETE && (
        <DeleteForm setSelectedAction={setSelectedAction} />
      )}
      {selectedAction === KVMAction.REFRESH && (
        <RefreshForm setSelectedAction={setSelectedAction} />
      )}
    </>
  );
};

export default KVMActionFormWrapper;
