import { useEffect } from "react";

import { Icon, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import type { SetSearchFilter } from "app/base/types";
import KVMDetailsHeader from "app/kvm/components/KVMDetailsHeader";
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
  const vmCount = pod?.resources.vm_count.tracked || 0;

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  return (
    <KVMDetailsHeader
      headerContent={headerContent}
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
          label: "Settings",
          to: kvmURLs.lxd.single.edit({ id }),
        },
      ]}
      setHeaderContent={setHeaderContent}
      setSearchFilter={setSearchFilter}
      titleBlocks={
        pod
          ? [
              {
                title: pod.name,
                subtitle: `Project: ${pod.power_parameters.project}`,
              },
              {
                title: `${vmCount} VM${vmCount === 1 ? "" : "s"} available`,
                subtitle: (
                  <>
                    <span className="u-nudge-left--small">
                      <Icon name="machines" />
                    </span>
                    Single host
                  </>
                ),
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

export default LXDSingleDetailsHeader;
