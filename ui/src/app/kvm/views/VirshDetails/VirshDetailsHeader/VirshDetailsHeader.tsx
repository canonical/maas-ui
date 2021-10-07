import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import KVMDetailsHeader from "app/kvm/components/KVMDetailsHeader";
import PodDetailsActionMenu from "app/kvm/components/PodDetailsActionMenu";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

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
  const vmCount = pod?.resources.vm_count.tracked || 0;

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  return (
    <KVMDetailsHeader
      buttons={[
        <PodDetailsActionMenu
          key="action-dropdown"
          setHeaderContent={setHeaderContent}
        />,
      ]}
      headerContent={headerContent}
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
      setHeaderContent={setHeaderContent}
      titleBlocks={
        pod
          ? [
              {
                title: pod.name,
                subtitle: pod.power_parameters.power_address,
              },
              {
                title: `${vmCount} VM${vmCount === 1 ? "" : "s"} available`,
              },
            ]
          : [
              {
                title: <Spinner text="Loading..." />,
              },
            ]
      }
    />
  );
};

export default VirshDetailsHeader;
