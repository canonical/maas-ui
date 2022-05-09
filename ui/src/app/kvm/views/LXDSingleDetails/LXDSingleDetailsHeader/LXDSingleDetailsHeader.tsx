import type { ReactNode } from "react";
import { useEffect } from "react";

import { Icon, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import type { SetSearchFilter } from "app/base/types";
import KVMDetailsHeader from "app/kvm/components/KVMDetailsHeader";
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
  setSearchFilter?: SetSearchFilter;
};

const LXDSingleDetailsHeader = ({
  id,
  headerContent,
  setHeaderContent,
  setSearchFilter,
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
      className="has-icon"
      headerContent={headerContent}
      loading={!pod}
      setHeaderContent={setHeaderContent}
      setSearchFilter={setSearchFilter}
      tabLinks={[
        {
          active: location.pathname.endsWith(kvmURLs.lxd.single.vms({ id })),
          component: Link,
          label: "Virtual machines",
          to: kvmURLs.lxd.single.vms({ id }),
        },
        {
          active: location.pathname.endsWith(
            kvmURLs.lxd.single.resources({ id })
          ),
          component: Link,
          label: "Resources",
          to: kvmURLs.lxd.single.resources({ id }),
        },
        {
          active: location.pathname.endsWith(kvmURLs.lxd.single.edit({ id })),
          component: Link,
          label: "KVM host settings",
          to: kvmURLs.lxd.single.edit({ id }),
        },
      ]}
      title={title}
      titleBlocks={
        pod
          ? [
              {
                title: (
                  <>
                    <Icon name="single-host" />
                    <span className="u-nudge-right--small">Single host</span>
                  </>
                ),
              },
              {
                subtitle: `${pod.resources.vm_count.tracked} available`,
                title: "VMs:",
              },
              {
                subtitle: zone?.name || <Spinner />,
                title: "AZ:",
              },
              {
                subtitle: pod.power_parameters.project,
                title: "LXD project:",
              },
            ]
          : []
      }
    />
  );
};

export default LXDSingleDetailsHeader;
