import DeleteSubnet from "./components/DeleteSubnet";
import EditBootArchitectures from "./components/EditBootArchitectures";
import MapSubnet from "./components/MapSubnet";

import { SubnetActionTypes } from "app/subnets/views/SubnetDetails/constants";
import type {
  SubnetAction,
  SubnetActionProps,
} from "app/subnets/views/SubnetDetails/types";

const FormComponents: Record<
  SubnetAction,
  ({ activeForm, setActiveForm }: SubnetActionProps) => JSX.Element | null
> = {
  [SubnetActionTypes.MapSubnet]: MapSubnet,
  [SubnetActionTypes.EditBootArchitectures]: EditBootArchitectures,
  [SubnetActionTypes.DeleteSubnet]: DeleteSubnet,
};

const SubnetActionForms = ({
  id,
  activeForm,
  setActiveForm,
}: SubnetActionProps): JSX.Element => {
  const FormComponent = activeForm ? FormComponents[activeForm] : () => null;

  return (
    <FormComponent
      id={id}
      activeForm={activeForm}
      setActiveForm={setActiveForm}
    />
  );
};

export default SubnetActionForms;
