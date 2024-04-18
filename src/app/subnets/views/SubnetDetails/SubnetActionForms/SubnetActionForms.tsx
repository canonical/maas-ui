import AddStaticRouteForm from "../StaticRoutes/AddStaticRouteForm";
import DeleteStaticRouteForm from "../StaticRoutes/DeleteStaticRouteform";
import EditStaticRouteForm from "../StaticRoutes/EditStaticRouteForm";

import DeleteSubnet from "./components/DeleteSubnet";
import EditBootArchitectures from "./components/EditBootArchitectures";
import MapSubnet from "./components/MapSubnet";

import ReservedRangeDeleteForm from "@/app/subnets/components/ReservedRangeDeleteForm";
import ReservedRangeForm from "@/app/subnets/components/ReservedRangeForm";
import { SubnetActionTypes } from "@/app/subnets/views/SubnetDetails/constants";
import type {
  SubnetAction,
  SubnetActionProps,
} from "@/app/subnets/views/SubnetDetails/types";

const FormComponents: Record<
  SubnetAction,
  ({ activeForm, setSidePanelContent }: SubnetActionProps) => JSX.Element | null
> = {
  [SubnetActionTypes.MapSubnet]: MapSubnet,
  [SubnetActionTypes.EditBootArchitectures]: EditBootArchitectures,
  [SubnetActionTypes.DeleteSubnet]: DeleteSubnet,
  [SubnetActionTypes.AddStaticRoute]: AddStaticRouteForm,
  [SubnetActionTypes.EditStaticRoute]: EditStaticRouteForm,
  [SubnetActionTypes.DeleteStaticRoute]: DeleteStaticRouteForm,
  [SubnetActionTypes.ReserveRange]: ReservedRangeForm,
  [SubnetActionTypes.DeleteReservedRange]: ReservedRangeDeleteForm,
  [SubnetActionTypes.ReserveStaticIP]: () => null,
  [SubnetActionTypes.EditStaticIP]: () => null,
  [SubnetActionTypes.DeleteStaticIP]: () => null,
};

const SubnetActionForms = ({
  subnetId,
  activeForm,
  setSidePanelContent,
  staticRouteId,
}: SubnetActionProps): JSX.Element => {
  const FormComponent = activeForm ? FormComponents[activeForm] : () => null;

  return (
    <FormComponent
      activeForm={activeForm}
      setSidePanelContent={setSidePanelContent}
      staticRouteId={staticRouteId}
      subnetId={subnetId}
    />
  );
};

export default SubnetActionForms;
