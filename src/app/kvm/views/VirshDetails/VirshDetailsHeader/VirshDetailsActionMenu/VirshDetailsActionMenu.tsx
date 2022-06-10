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
              view: KVMHeaderViews.COMPOSE_VM,
              extras: { hostId },
            }),
        },
        {
          children: "Refresh",
          onClick: () =>
            setHeaderContent({
              view: KVMHeaderViews.REFRESH_KVM,
              extras: { hostIds: [hostId] },
            }),
        },
        {
          children: "Delete",
          onClick: () =>
            setHeaderContent({
              view: KVMHeaderViews.DELETE_KVM,
              extras: { hostId },
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
