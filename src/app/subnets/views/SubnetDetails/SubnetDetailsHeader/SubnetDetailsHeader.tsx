import { ContextualMenu } from "@canonical/react-components";

import SectionHeader from "app/base/components/SectionHeader";
import { useSidePanel } from "app/base/side-panel-context";
import type { Subnet } from "app/store/subnet/types";
import { isSubnetDetails } from "app/store/subnet/utils";
import {
  subnetActionLabels,
  SubnetActionTypes,
  SubnetDetailsSidePanelViews,
} from "app/subnets/views/SubnetDetails/constants";

type Props = {
  subnet: Subnet;
};

const SubnetDetailsHeader = ({ subnet }: Props): JSX.Element => {
  const { setSidePanelContent } = useSidePanel();
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
            onClick: () =>
              setSidePanelContent({ view: SubnetDetailsSidePanelViews[view] }),
          }))}
          position="right"
          toggleAppearance="positive"
          toggleLabel="Take action"
        />,
      ]}
      subtitleLoading={!isSubnetDetails(subnet)}
      title={subnet.name}
    />
  );
};

export default SubnetDetailsHeader;
