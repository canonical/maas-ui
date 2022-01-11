import { useDispatch } from "react-redux";

import AddFabric from "./components/AddFabric";
import type { SubnetForm } from "app/subnets/types";
import { SubnetForms } from "app/subnets/enum";

const FormComponents: Record<
  SubnetForm,
  ({ activeForm, setActiveForm }: FormActionProps) => JSX.Element | null
> = {
  [SubnetForms.Fabric]: AddFabric,
  [SubnetForms.VLAN]: () => null,
  [SubnetForms.Space]: () => null,
  [SubnetForms.Subnet]: () => null,
};

export interface FormActionProps {
  activeForm?: SubnetForm;
  setActiveForm: React.Dispatch<React.SetStateAction<SubnetForm | undefined>>;
}

const FormActions = ({ activeForm, setActiveForm }: FormActionProps) => {
  const FormComponent = activeForm ? FormComponents[activeForm] : () => null;

  const Form = () =>
    activeForm ? (
      <section className="p-strip is-shallow">
        <div className="row">
          <FormComponent
            activeForm={activeForm}
            setActiveForm={setActiveForm}
          />
        </div>
      </section>
    ) : null;

  return <Form />;
};

export default FormActions;
