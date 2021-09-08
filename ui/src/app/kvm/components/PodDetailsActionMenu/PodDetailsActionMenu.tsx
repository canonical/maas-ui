import { ContextualMenu } from "@canonical/react-components";

import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetHeaderContent } from "app/kvm/types";

type Props = { setHeaderContent: KVMSetHeaderContent };

const PodDetailsActionMenu = ({ setHeaderContent }: Props): JSX.Element => {
  return (
    <ContextualMenu
      data-test="action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Compose",
          onClick: () => setHeaderContent({ view: KVMHeaderViews.COMPOSE_VM }),
        },
        {
          children: "Refresh",
          onClick: () => setHeaderContent({ view: KVMHeaderViews.REFRESH_KVM }),
        },
        {
          children: "Delete",
          onClick: () => setHeaderContent({ view: KVMHeaderViews.DELETE_KVM }),
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleLabel="Take action"
    />
  );
};

export default PodDetailsActionMenu;
