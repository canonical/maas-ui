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
  [SubnetActionTypes.EditBootArchitectures]: EditBootArchitectures,
  [SubnetActionTypes.MapSubnet]: MapSubnet,
  [SubnetActionTypes.DeleteSubnet]: DeleteSubnet,
};

const SubnetActionForms = ({
  activeForm,
  setActiveForm,
}: SubnetActionProps): JSX.Element => {
  const FormComponent = activeForm ? FormComponents[activeForm] : () => null;

  return (
    <FormComponent activeForm={activeForm} setActiveForm={setActiveForm} />
  );
};

export default SubnetActionForms;
