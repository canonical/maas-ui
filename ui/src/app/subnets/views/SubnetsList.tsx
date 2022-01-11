import React from "react";

import { ContextualMenu } from "@canonical/react-components";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import FormActions from "app/subnets/views/FormActions";
import type { SubnetForm } from "app/subnets/types";

const getButtons = (
  links: SubnetForm[],
  onClick: React.Dispatch<React.SetStateAction<SubnetForm | undefined>>
) =>
  links.map((children) => ({
    children: children as React.ReactNode,
    onClick: () => onClick(children) as any,
  }));

const SubnetsList = (): React.ReactElement => {
  const [activeForm, setActiveForm] = React.useState<SubnetForm | undefined>(
    undefined
  );

  return (
    <Section
      header={
        <>
          <SectionHeader
            title="Subnets"
            buttons={[
              <ContextualMenu
                toggleLabel="Add"
                toggleAppearance="positive"
                hasToggleIcon
                position="right"
                links={getButtons(
                  ["Fabric", "VLAN", "Space", "Subnet"],
                  setActiveForm
                )}
              />,
            ]}
          />
          <FormActions activeForm={activeForm} setActiveForm={setActiveForm} />
        </>
      }
    ></Section>
  );
};

export default SubnetsList;
