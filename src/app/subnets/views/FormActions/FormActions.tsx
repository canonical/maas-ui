import AddFabric from "./components/AddFabric";
import AddSpace from "./components/AddSpace";
import AddSubnet from "./components/AddSubnet";
import AddVlan from "./components/AddVlan";

import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { SubnetForms } from "@/app/subnets/constants";
import type { SubnetForm } from "@/app/subnets/types";

const FormComponents: Record<
  SubnetForm,
  ({ activeForm, setActiveForm }: FormActionProps) => React.ReactElement | null
> = {
  [SubnetForms.Fabric]: AddFabric,
  [SubnetForms.VLAN]: AddVlan,
  [SubnetForms.Space]: AddSpace,
  [SubnetForms.Subnet]: AddSubnet,
};

export interface FormActionProps {
  readonly activeForm: SubnetForm;
  readonly setActiveForm: SetSidePanelContent;
}

const FormActions = ({
  activeForm,
  setActiveForm,
}: FormActionProps): React.ReactElement => {
  const FormComponent = activeForm ? FormComponents[activeForm] : () => null;

  return (
    <FormComponent activeForm={activeForm} setActiveForm={setActiveForm} />
  );
};

export default FormActions;
