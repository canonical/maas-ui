import { ContextualMenu } from "@canonical/react-components";

import type { KVMSetSelectedAction } from "app/kvm/views/KVMDetails/KVMDetails";
import { PodFormNames } from "app/store/ui/types";

type Props = { setSelectedAction: KVMSetSelectedAction };

const PodDetailsActionMenu = ({ setSelectedAction }: Props): JSX.Element => {
  return (
    <ContextualMenu
      data-test="action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Compose",
          onClick: () => setSelectedAction(PodFormNames.COMPOSE),
        },
        {
          children: "Refresh",
          onClick: () => setSelectedAction(PodFormNames.REFRESH),
        },
        {
          children: "Delete",
          onClick: () => setSelectedAction(PodFormNames.DELETE),
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleLabel="Take action"
    />
  );
};

export default PodDetailsActionMenu;
