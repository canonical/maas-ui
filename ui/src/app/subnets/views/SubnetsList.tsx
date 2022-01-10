import React from "react";

import { ContextualMenu } from "@canonical/react-components";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";

const getButtons = (links: string[]) =>
  links.map((children) => ({
    children,
    onClick: () => null,
  }));

const SubnetsList = (): React.ReactElement => (
  <Section
    header={
      <SectionHeader
        title="Subnets"
        buttons={[
          <ContextualMenu
            toggleLabel="Add"
            toggleAppearance="positive"
            hasToggleIcon
            position="right"
            links={getButtons(["Fabric", "VLAN", "Space", "Subnet"])}
          />,
        ]}
      />
    }
  />
);

export default SubnetsList;
