import { ContextualMenu } from "@canonical/react-components";

import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetSidePanelContent } from "app/kvm/types";
import type { Pod } from "app/store/pod/types";

type Props = {
  hostId: Pod["id"];
  setSidePanelContent: KVMSetSidePanelContent;
};

const PodDetailsActionMenu = ({
  hostId,
  setSidePanelContent,
}: Props): JSX.Element => {
  return (
    <ContextualMenu
      data-testid="action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Compose",
          onClick: () =>
            setSidePanelContent({
              view: KVMHeaderViews.COMPOSE_VM,
              extras: { hostId },
            }),
        },
        {
          children: "Refresh",
          onClick: () =>
            setSidePanelContent({
              view: KVMHeaderViews.REFRESH_KVM,
              extras: { hostIds: [hostId] },
            }),
        },
        {
          children: "Delete",
          onClick: () =>
            setSidePanelContent({
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
