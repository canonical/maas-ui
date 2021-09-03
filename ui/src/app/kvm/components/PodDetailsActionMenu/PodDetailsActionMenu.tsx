import { ContextualMenu } from "@canonical/react-components";

import type { KVMSetHeaderContent } from "app/kvm/types";
import { PodAction } from "app/store/pod/types";

type Props = { setHeaderContent: KVMSetHeaderContent };

const PodDetailsActionMenu = ({ setHeaderContent }: Props): JSX.Element => {
  return (
    <ContextualMenu
      data-test="action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Compose",
          onClick: () => setHeaderContent(PodAction.COMPOSE),
        },
        {
          children: "Refresh",
          onClick: () => setHeaderContent(PodAction.REFRESH),
        },
        {
          children: "Delete",
          onClick: () => setHeaderContent(PodAction.DELETE),
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleLabel="Take action"
    />
  );
};

export default PodDetailsActionMenu;
