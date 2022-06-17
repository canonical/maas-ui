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
      buttons={[
        <ContextualMenu
          hasToggleIcon
          links={[
            SubnetActionTypes.MapSubnet,
            SubnetActionTypes.EditBootArchitectures,
            SubnetActionTypes.DeleteSubnet,
          ].map((subnetActionForm) => ({
            children: subnetActionLabels[subnetActionForm],
            onClick: () => setActiveForm(subnetActionForm),
          }))}
          position="right"
          toggleAppearance="positive"
          toggleLabel="Take action"
        />,
      ]}
      headerContent={
        activeForm ? (
          <SubnetActionForms
            activeForm={activeForm}
            id={subnet.id}
            setActiveForm={setActiveForm}
          />
        ) : null
      }
      subtitleLoading={!isSubnetDetails(subnet)}
      title={subnet.name}
    />
  );
};

export default SubnetDetailsHeader;
