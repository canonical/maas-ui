import type { ReactElement } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { ContextualMenu } from "@canonical/react-components";

import { useCanEditVMHost } from "@/app/base/hooks/permissions";
import ComposeForm from "@/app/kvm/components/ComposeForm";
import DeleteForm from "@/app/kvm/components/DeleteForm";
import RefreshForm from "@/app/kvm/components/RefreshForm";
import type { Pod } from "@/app/store/pod/types";

type Props = {
  hostId: Pod["id"];
};

const PodDetailsActionMenu = ({ hostId }: Props): ReactElement => {
  const { openSidePanel } = useSidePanel();
  const canEdit = useCanEditVMHost(hostId);

  return (
    <ContextualMenu
      data-testid="action-dropdown"
      hasToggleIcon
      links={[
        {
          children: "Compose",
          onClick: () => {
            openSidePanel({
              component: ComposeForm,
              title: "Compose",
              props: { hostId },
            });
          },
        },
        {
          children: "Refresh",
          onClick: () => {
            openSidePanel({
              component: RefreshForm,
              title: "Refresh",
              props: { hostIds: [hostId] },
            });
          },
        },
        {
          children: "Delete",
          onClick: () => {
            openSidePanel({
              component: DeleteForm,
              title: "Delete KVM",
              props: { hostId },
            });
          },
        },
      ]}
      position="right"
      toggleAppearance="positive"
      toggleDisabled={!canEdit}
      toggleLabel="Take action"
    />
  );
};

export default PodDetailsActionMenu;
