import { ContextualMenu } from "@canonical/react-components";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import SectionHeader from "@/app/base/components/SectionHeader";
import { useSidePanel } from "@/app/base/side-panel-context";
import type { Subnet } from "@/app/store/subnet/types";
import { isSubnetDetails } from "@/app/store/subnet/utils";
import {
  subnetActionLabels,
  SubnetActionTypes,
  SubnetDetailsSidePanelViews,
} from "@/app/subnets/views/SubnetDetails/constants";

type Props = {
  subnet: Subnet;
};

const SubnetDetailsHeader = ({ subnet }: Props): JSX.Element => {
  const { setSidePanelContent } = useSidePanel();
  const { pathname } = useLocation();
  const urlBase = `/subnet/${subnet.id}`;
  return (
    <SectionHeader
      buttons={[
        <ContextualMenu
          hasToggleIcon
          links={[
            SubnetActionTypes.MapSubnet,
            SubnetActionTypes.EditBootArchitectures,
            SubnetActionTypes.DeleteSubnet,
          ].map((view) => ({
            children: subnetActionLabels[view],
            onClick: () => {
              setSidePanelContent({ view: SubnetDetailsSidePanelViews[view] });
            },
          }))}
          position="right"
          toggleAppearance="positive"
          toggleLabel="Take action"
        />,
      ]}
      subtitleLoading={!isSubnetDetails(subnet)}
      tabLinks={[
        {
          active: pathname.startsWith(`${urlBase}/summary`),
          component: Link,
          label: "Subnet summary",
          to: `${urlBase}/summary`,
        },
        {
          active: pathname.startsWith(`${urlBase}/static-routes`),
          component: Link,
          label: "Static routes",
          to: `${urlBase}/static-routes`,
        },
        {
          active: pathname.startsWith(`${urlBase}/address-reservation`),
          component: Link,
          label: "Address reservation",
          to: `${urlBase}/address-reservation`,
        },
        {
          active: pathname.startsWith(`${urlBase}/dhcp-snippets`),
          component: Link,
          label: "DHCP snippets",
          to: `${urlBase}/dhcp-snippets`,
        },
        {
          active: pathname.startsWith(`${urlBase}/used-ip-addresses`),
          component: Link,
          label: "Used IP addresses",
          to: `${urlBase}/used-ip-addresses`,
        },
      ]}
      title={subnet.name}
    />
  );
};

export default SubnetDetailsHeader;
