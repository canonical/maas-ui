import { ContextualMenu } from "@canonical/react-components";

import SectionHeader from "app/base/components/SectionHeader";
import { useSidePanel } from "app/base/side-panel-context";
import type { Subnet } from "app/store/subnet/types";
import { isSubnetDetails } from "app/store/subnet/utils";
import SubnetActionForms from "app/subnets/views/SubnetDetails/SubnetDetailsHeader/SubnetActionForms/SubnetActionForms";
import {
  subnetActionLabels,
  SubnetActionTypes,
  SubnetDetailsSidePanelViews,
} from "app/subnets/views/SubnetDetails/constants";

type Props = {
  subnet: Subnet;
};

const SubnetDetailsHeader = ({ subnet }: Props): JSX.Element => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const [, name] = sidePanelContent?.view || [];
  const activeForm =
    name && Object.keys(SubnetActionTypes).includes(name)
      ? (name as keyof typeof SubnetActionTypes)
      : null;
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
      sidePanelContent={
        activeForm ? (
          <SubnetActionForms
            activeForm={activeForm}
            id={subnet.id}
            setActiveForm={setSidePanelContent}
          />
        ) : null
      }
      sidePanelTitle={activeForm ? subnetActionLabels[activeForm] : ""}
      subtitleLoading={!isSubnetDetails(subnet)}
      title={subnet.name}
    />
  );
};

export default SubnetDetailsHeader;
