import type { ReactElement } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { ContextualMenu } from "@canonical/react-components";
import { useLocation } from "react-router";

import AddFabric from "../AddFabric";
import AddSpace from "../AddSpace";
import AddSubnet from "../AddSubnet";
import AddVlan from "../AddVlan";

import SectionHeader from "@/app/base/components/SectionHeader";
import { useHasEntitlements } from "@/app/base/hooks";
import urls from "@/app/networks/urls";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

type Props = {
  controls?: ReactElement;
};

const getTitle = (pathname: string): string => {
  if (pathname.startsWith(urls.vlans.index)) {
    return "VLANs";
  }
  if (pathname.startsWith(urls.fabrics.index)) {
    return "Fabrics";
  }
  if (pathname.startsWith(urls.spaces.index)) {
    return "Spaces";
  }
  if (pathname.startsWith(urls.subnets.index)) {
    return "Subnets";
  }
  return "Networks";
};

const NetworksHeader = ({ controls }: Props) => {
  const { pathname } = useLocation();
  const { openSidePanel } = useSidePanel();
  const { allowed: canEdit } = useHasEntitlements([
    Entitlement.CAN_EDIT_GLOBAL_ENTITIES,
  ]);

  return (
    <SectionHeader
      renderButtons={() => (
        <>
          {controls}
          <ContextualMenu
            hasToggleIcon
            links={[
              {
                children: "Fabric",
                onClick: () => {
                  openSidePanel({ component: AddFabric, title: "Add fabric" });
                },
              },
              {
                children: "VLAN",
                onClick: () => {
                  openSidePanel({ component: AddVlan, title: "Add VLAN" });
                },
              },
              {
                children: "Space",
                onClick: () => {
                  openSidePanel({ component: AddSpace, title: "Add space" });
                },
              },
              {
                children: "Subnet",
                onClick: () => {
                  openSidePanel({ component: AddSubnet, title: "Add subnet" });
                },
              },
            ]}
            position="right"
            toggleAppearance="positive"
            toggleDisabled={!canEdit}
            toggleLabel="Add"
          />
        </>
      )}
      title={getTitle(pathname)}
    />
  );
};

export default NetworksHeader;
