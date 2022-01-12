import React from "react";

import { ContextualMenu } from "@canonical/react-components";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import { SubnetForms } from "app/subnets/enum";
import type { SubnetForm } from "app/subnets/types";
import FormActions from "app/subnets/views/FormActions";

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
                links={[
                  SubnetForms.Fabric,
                  SubnetForms.VLAN,
                  SubnetForms.Space,
                  SubnetForms.Subnet,
                ].map((children) => ({
                  children,
                  onClick: () => setActiveForm(children),
                }))}
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
