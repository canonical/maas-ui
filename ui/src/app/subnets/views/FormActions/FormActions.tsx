import AddFabric from "./components/AddFabric";
import AddSpace from "./components/AddSpace";

import { SubnetForms } from "app/subnets/enum";
import type { SubnetForm } from "app/subnets/types";

const FormComponents: Record<
  SubnetForm,
  ({ activeForm, setActiveForm }: FormActionProps) => JSX.Element | null
> = {
  [SubnetForms.Fabric]: AddFabric,
  [SubnetForms.VLAN]: () => null,
  [SubnetForms.Space]: AddSpace,
  [SubnetForms.Subnet]: () => null,
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

  const Form = () => (
    <>
      <h2 className="p-heading--5">Add {activeForm}</h2>
      <FormComponent activeForm={activeForm} setActiveForm={setActiveForm} />
    </>
  );

  return <Form />;
};

export default FormActions;
