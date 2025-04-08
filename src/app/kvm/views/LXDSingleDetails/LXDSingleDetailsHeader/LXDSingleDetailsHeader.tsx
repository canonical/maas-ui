import type { ReactNode } from "react";

import { Button, Icon, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router";

import { useGetZone } from "@/app/api/query/zones";
import { useFetchActions } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import KVMDetailsHeader from "@/app/kvm/components/KVMDetailsHeader";
import { KVMSidePanelViews } from "@/app/kvm/constants";
import type { KVMSetSidePanelContent } from "@/app/kvm/types";
import { podActions } from "@/app/store/pod";
import podSelectors from "@/app/store/pod/selectors";
import type { Pod } from "@/app/store/pod/types";
import type { RootState } from "@/app/store/root/types";

type Props = {
  id: Pod["id"];
  setSidePanelContent: KVMSetSidePanelContent;
};

const LXDSingleDetailsHeader = ({
  id,
  setSidePanelContent,
}: Props): React.ReactElement => {
  const location = useLocation();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  // id will be of a known pod, so we can safely assume that pod will be defined
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const zone = useGetZone({ path: { zone_id: pod?.zone! } });

  useFetchActions([podActions.fetch]);

  let title: ReactNode = <Spinner text="Loading..." />;
  if (pod) {
    title = pod.name;
  }

  return (
    <KVMDetailsHeader
      buttons={[
        <Button
          appearance="positive"
          disabled={!pod}
          hasIcon
          onClick={() => {
            setSidePanelContent({
              view: KVMSidePanelViews.REFRESH_KVM,
              extras: { hostIds: [id] },
            });
          }}
        >
          <Icon light name="restart" />
          <span>Refresh host</span>
        </Button>,
      ]}
      className="has-icon"
      loading={!pod}
      setSidePanelContent={setSidePanelContent}
      tabLinks={[
        {
          active: location.pathname.endsWith(urls.kvm.lxd.single.vms({ id })),
          component: Link,
          label: "Virtual machines",
          to: urls.kvm.lxd.single.vms({ id }),
        },
        {
          active: location.pathname.endsWith(
            urls.kvm.lxd.single.resources({ id })
          ),
          component: Link,
          label: "Resources",
          to: urls.kvm.lxd.single.resources({ id }),
        },
        {
          active: location.pathname.endsWith(urls.kvm.lxd.single.edit({ id })),
          component: Link,
          label: "KVM host settings",
          to: urls.kvm.lxd.single.edit({ id }),
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
                title: "VMs:",
                subtitle: `${pod.resources.vm_count.tracked} available`,
              },
              {
                title: "AZ:",
                subtitle: zone?.data?.name || <Spinner />,
              },
              {
                title: "LXD project:",
                subtitle: pod.power_parameters?.project,
              },
            ]
          : []
      }
    />
  );
};

export default LXDSingleDetailsHeader;
