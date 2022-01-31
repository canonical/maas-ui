import { useState } from "react";

import { ContextualMenu } from "@canonical/react-components";

import SectionHeader from "app/base/components/SectionHeader";
import type { Subnet } from "app/store/subnet/types";
import { isSubnetDetails } from "app/store/subnet/utils";
import SubnetActionForms from "app/subnets/views/SubnetDetails/SubnetDetailsHeader/SubnetActionForms/SubnetActionForms";
import {
  subnetActionLabels,
  SubnetActionTypes,
} from "app/subnets/views/SubnetDetails/constants";
import type { SubnetAction } from "app/subnets/views/SubnetDetails/types";

type Props = {
  subnet: Subnet;
};

const SubnetDetailsHeader = ({ subnet }: Props): JSX.Element => {
  const [activeForm, setActiveForm] = useState<SubnetAction | null>(null);

  return (
    <SectionHeader
      subtitleLoading={!isSubnetDetails(subnet)}
      title={subnet.name}
      buttons={[
        <ContextualMenu
          toggleLabel="Take action"
          toggleAppearance="positive"
          hasToggleIcon
          position="right"
          links={[
            SubnetActionTypes.MapSubnet,
            SubnetActionTypes.EditBootArchitectures,
            SubnetActionTypes.DeleteSubnet,
          ].map((subnetActionForm) => ({
            children: subnetActionLabels[subnetActionForm],
            onClick: () => setActiveForm(subnetActionForm),
          }))}
        />,
      ]}
      headerContent={
        activeForm ? (
          <SubnetActionForms
            activeForm={activeForm}
            setActiveForm={setActiveForm}
          />
        ) : null
      }
    />
  );
};

export default SubnetDetailsHeader;
