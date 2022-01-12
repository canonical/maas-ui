import AddFabric from "./components/AddFabric";

import { SubnetForms } from "app/subnets/enum";
import type { SubnetForm } from "app/subnets/types";

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
      <section className="p-strip is-shallow u-no-padding--top">
        <div className="row">
          <h2 className="p-heading--5">Add {activeForm}</h2>
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
