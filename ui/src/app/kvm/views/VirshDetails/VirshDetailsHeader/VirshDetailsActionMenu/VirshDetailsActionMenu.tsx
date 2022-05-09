import { ContextualMenu } from "@canonical/react-components";

import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetHeaderContent } from "app/kvm/types";
import type { Pod } from "app/store/pod/types";

type Props = {
  hostId: Pod["id"];
  setHeaderContent: KVMSetHeaderContent;
};

const PodDetailsActionMenu = ({
  hostId,
  setHeaderContent,
}: Props): JSX.Element => {
  return (
    <ContextualMenu
      data-testid="action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Compose",
          onClick: () =>
            setHeaderContent({
              extras: { hostId },
              view: KVMHeaderViews.COMPOSE_VM,
            }),
        },
        {
          children: "Refresh",
          onClick: () =>
            setHeaderContent({
              extras: { hostIds: [hostId] },
              view: KVMHeaderViews.REFRESH_KVM,
            }),
        },
        {
          children: "Delete",
          onClick: () =>
            setHeaderContent({
              extras: { hostId },
              view: KVMHeaderViews.DELETE_KVM,
            }),
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleLabel="Take action"
    />
  );
};

export default PodDetailsActionMenu;
