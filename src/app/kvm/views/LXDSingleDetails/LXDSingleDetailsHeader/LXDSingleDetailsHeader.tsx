import type { ReactElement, ReactNode } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { Button, Icon, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";

import { useGetZone } from "@/app/api/query/zones";
import { useFetchActions } from "@/app/base/hooks";
import {
  useCanEditVMHost,
  useHasEntitlements,
} from "@/app/base/hooks/permissions";
import urls from "@/app/base/urls";
import KVMDetailsHeader from "@/app/kvm/components/KVMDetailsHeader";
import RefreshForm from "@/app/kvm/components/RefreshForm";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { podActions } from "@/app/store/pod";
import podSelectors from "@/app/store/pod/selectors";
import type { Pod } from "@/app/store/pod/types";
import type { RootState } from "@/app/store/root/types";

type Props = {
  id: Pod["id"];
};

const LXDSingleDetailsHeader = ({ id }: Props): ReactElement => {
  const location = useLocation();
  const { openSidePanel } = useSidePanel();

  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const canEdit = useCanEditVMHost(id);
  const canViewSettings = useHasEntitlements([
    Entitlement.CAN_VIEW_GLOBAL_ENTITIES,
  ]);
  // id will be of a known pod, so we can safely assume that pod will be defined
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const zone = useGetZone({ path: { zone_id: pod?.zone! } });

  useFetchActions([podActions.fetch]);

  let title: ReactNode = <Spinner text="Loading..." />;
  if (pod) {
    title = pod.name;
  }

  const settingsTab = {
    active: location.pathname.endsWith(urls.kvm.lxd.single.edit({ id })),
    label: "KVM host settings",
  };

  return (
    <KVMDetailsHeader
      buttons={[
        <Button
          appearance="positive"
          disabled={!pod || !canEdit}
          hasIcon
          onClick={() => {
            openSidePanel({
              component: RefreshForm,
              title: "Refresh",
              props: {
                hostIds: [id],
              },
            });
          }}
        >
          <Icon light name="restart" />
          <span>Refresh host</span>
        </Button>,
      ]}
      className="has-icon"
      loading={!pod}
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
        canViewSettings
          ? {
              ...settingsTab,
              component: Link,
              to: urls.kvm.lxd.single.edit({ id }),
            }
          : {
              ...settingsTab,
              "aria-disabled": true,
              className: "is-disabled",
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
