import type { ReactNode } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import VirshDetailsActionMenu from "./VirshDetailsActionMenu";

import { useFetchActions } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import KVMDetailsHeader from "@/app/kvm/components/KVMDetailsHeader";
import type { KVMSetSidePanelContent } from "@/app/kvm/types";
import { podActions } from "@/app/store/pod";
import podSelectors from "@/app/store/pod/selectors";
import type { Pod } from "@/app/store/pod/types";
import type { RootState } from "@/app/store/root/types";
import { zoneActions } from "@/app/store/zone";
import zoneSelectors from "@/app/store/zone/selectors";

type Props = {
  id: Pod["id"];
  setSidePanelContent: KVMSetSidePanelContent;
};

const VirshDetailsHeader = ({
  id,
  setSidePanelContent,
}: Props): JSX.Element => {
  const location = useLocation();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, pod?.zone)
  );

  useFetchActions([podActions.fetch, zoneActions.fetch]);

  let title: ReactNode = <Spinner text="Loading..." />;
  if (pod) {
    title = pod.name;
  }

  return (
    <KVMDetailsHeader
      buttons={
        pod
          ? [
              <VirshDetailsActionMenu
                hostId={pod.id}
                key="action-dropdown"
                setSidePanelContent={setSidePanelContent}
              />,
            ]
          : null
      }
      loading={!pod}
      setSidePanelContent={setSidePanelContent}
      tabLinks={[
        {
          active: location.pathname.endsWith(
            urls.kvm.virsh.details.resources({ id })
          ),
          component: Link,
          label: "Resources",
          to: urls.kvm.virsh.details.resources({ id }),
        },
        {
          active: location.pathname.endsWith(
            urls.kvm.virsh.details.edit({ id })
          ),
          component: Link,
          label: "Settings",
          to: urls.kvm.virsh.details.edit({ id }),
        },
      ]}
      title={title}
      titleBlocks={
        pod
          ? [
              {
                title: "Power address:",
                subtitle: pod.power_parameters?.power_address,
              },
              {
                title: "VMs:",
                subtitle: `${pod.resources.vm_count.tracked} available`,
              },
              {
                title: "AZ:",
                subtitle: zone?.name || <Spinner />,
              },
            ]
          : []
      }
    />
  );
};

export default VirshDetailsHeader;
