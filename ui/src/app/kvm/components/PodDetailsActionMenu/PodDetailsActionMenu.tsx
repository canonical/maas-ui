import { ContextualMenu } from "@canonical/react-components";

import { KVMHeaderNames } from "app/kvm/constants";
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
          onClick: () => setHeaderContent({ name: KVMHeaderNames.COMPOSE_VM }),
        },
        {
          children: "Refresh",
          onClick: () => setHeaderContent({ name: KVMHeaderNames.REFRESH_KVM }),
        },
        {
          children: "Delete",
          onClick: () => setHeaderContent({ name: KVMHeaderNames.DELETE_KVM }),
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleLabel="Take action"
    />
  );
};

export default PodDetailsActionMenu;
