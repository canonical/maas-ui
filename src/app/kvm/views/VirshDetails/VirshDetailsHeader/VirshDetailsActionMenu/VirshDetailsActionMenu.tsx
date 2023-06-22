import { ContextualMenu } from "@canonical/react-components";

import { KVMSidePanelViews } from "app/kvm/constants";
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
              view: KVMSidePanelViews.COMPOSE_VM,
              extras: { hostId },
            }),
        },
        {
          children: "Refresh",
          onClick: () =>
            setSidePanelContent({
              view: KVMSidePanelViews.REFRESH_KVM,
              extras: { hostIds: [hostId] },
            }),
        },
        {
          children: "Delete",
          onClick: () =>
            setSidePanelContent({
              view: KVMSidePanelViews.DELETE_KVM,
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
