import AddFabric from "./components/AddFabric";
import AddSpace from "./components/AddSpace";
import AddSubnet from "./components/AddSubnet";
import AddVlan from "./components/AddVlan";

import { SubnetForms } from "app/subnets/enum";
import type { SubnetForm } from "app/subnets/types";

const FormComponents: Record<
  SubnetForm,
  ({ activeForm, setActiveForm }: FormActionProps) => JSX.Element | null
> = {
  [SubnetForms.Fabric]: AddFabric,
  [SubnetForms.VLAN]: AddVlan,
  [SubnetForms.Space]: AddSpace,
  [SubnetForms.Subnet]: AddSubnet,
};

export interface FormActionProps {
  activeForm: SubnetForm;
  setActiveForm: React.Dispatch<React.SetStateAction<SubnetForm | null>>;
}

const FormActions = ({
  activeForm,
  setActiveForm,
}: FormActionProps): JSX.Element => {
  const FormComponent = activeForm ? FormComponents[activeForm] : () => null;

  return (
    <FormComponent activeForm={activeForm} setActiveForm={setActiveForm} />
  );
};

export default FormActions;
