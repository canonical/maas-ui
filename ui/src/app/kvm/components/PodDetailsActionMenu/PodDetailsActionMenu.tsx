import { ContextualMenu } from "@canonical/react-components";

import type { KVMSetSelectedAction } from "app/kvm/views/KVMDetails/KVMDetails";
import { PodAction } from "app/store/pod/types";

type Props = { setSelectedAction: KVMSetSelectedAction };

const PodDetailsActionMenu = ({ setSelectedAction }: Props): JSX.Element => {
  return (
    <ContextualMenu
      data-test="action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Compose",
          onClick: () => setSelectedAction(PodAction.COMPOSE),
        },
        {
          children: "Refresh",
          onClick: () => setSelectedAction(PodAction.REFRESH),
        },
        {
          children: "Delete",
          onClick: () => setSelectedAction(PodAction.DELETE),
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleLabel="Take action"
    />
  );
};

export default PodDetailsActionMenu;
