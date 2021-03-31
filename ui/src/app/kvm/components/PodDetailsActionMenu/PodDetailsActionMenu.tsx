import { ContextualMenu } from "@canonical/react-components";

import { KVMAction } from "app/kvm/views/KVMDetails";
import type { SetSelectedAction } from "app/kvm/views/KVMDetails";

type Props = { setSelectedAction: SetSelectedAction };

const PodDetailsActionMenu = ({ setSelectedAction }: Props): JSX.Element => {
  return (
    <ContextualMenu
      data-test="action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Compose",
          onClick: () => setSelectedAction(KVMAction.COMPOSE),
        },
        {
          children: "Refresh",
          onClick: () => setSelectedAction(KVMAction.REFRESH),
        },
        {
          children: "Delete",
          onClick: () => setSelectedAction(KVMAction.DELETE),
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleLabel="Take action"
    />
  );
};

export default PodDetailsActionMenu;
