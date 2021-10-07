import type { ReactNode } from "react";
import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import KVMDetailsHeader from "app/kvm/components/KVMDetailsHeader";
import PodDetailsActionMenu from "app/kvm/components/PodDetailsActionMenu";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { getFormTitle } from "app/kvm/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  id: Pod["id"];
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
};

const VirshDetailsHeader = ({
  id,
  headerContent,
  setHeaderContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, pod?.zone)
  );

  useEffect(() => {
    dispatch(podActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  let title: ReactNode = <Spinner text="Loading..." />;
  if (pod) {
    if (headerContent) {
      title = getFormTitle(headerContent);
    } else {
      title = pod.name;
    }
  }

  return (
    <KVMDetailsHeader
      buttons={[
        <PodDetailsActionMenu
          key="action-dropdown"
          setHeaderContent={setHeaderContent}
        />,
      ]}
      headerContent={headerContent}
      setHeaderContent={setHeaderContent}
      tabLinks={[
        {
          active: location.pathname.endsWith(
            kvmURLs.virsh.details.resources({ id })
          ),
          component: Link,
          label: "Resources",
          to: kvmURLs.virsh.details.resources({ id }),
        },
        {
          active: location.pathname.endsWith(
            kvmURLs.virsh.details.edit({ id })
          ),
          component: Link,
          label: "Settings",
          to: kvmURLs.virsh.details.edit({ id }),
        },
      ]}
      title={title}
      titleBlocks={
        pod
          ? [
              {
                title: "Power address:",
                subtitle: pod.power_parameters.power_address,
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
