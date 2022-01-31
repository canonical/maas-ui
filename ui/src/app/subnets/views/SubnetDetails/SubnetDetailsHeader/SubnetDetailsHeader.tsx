import { useState } from "react";

import { ContextualMenu } from "@canonical/react-components";

import SubnetDelete from "./SubnetDelete";

import SectionHeader from "app/base/components/SectionHeader";
import type { Subnet } from "app/store/subnet/types";
import { isSubnetDetails } from "app/store/subnet/utils";

type Props = {
  subnet: Subnet;
};

const subnetActions = [
  "Map subnet",
  "Edit boot architectures",
  "Delete",
] as const;

const SubnetDetailsHeader = ({ subnet }: Props): JSX.Element => {
  const [activeForm, setActiveForm] = useState<
    typeof subnetActions[number] | null
  >(null);

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
          links={subnetActions.map((children) => ({
            children,
            disabled: children !== "Delete",
            onClick: () => setActiveForm(children),
          }))}
        />,
      ]}
      headerContent={
        activeForm === "Delete" ? (
          <SubnetDelete
            subnet={subnet}
            handleClose={() => setActiveForm(null)}
          />
        ) : null
      }
    />
  );
};

export default SubnetDetailsHeader;
