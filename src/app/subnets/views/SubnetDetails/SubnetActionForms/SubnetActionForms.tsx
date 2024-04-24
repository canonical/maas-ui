import DeleteSubnet from "./components/DeleteSubnet";
import EditBootArchitectures from "./components/EditBootArchitectures";
import MapSubnet from "./components/MapSubnet";

import ReservedRangeDeleteForm from "@/app/subnets/components/ReservedRangeDeleteForm";
import ReservedRangeForm from "@/app/subnets/components/ReservedRangeForm";
import DeleteDHCPLease from "@/app/subnets/views/SubnetDetails/StaticDHCPLease/DeleteDHCPLease";
import AddStaticRouteForm from "@/app/subnets/views/SubnetDetails/StaticRoutes/AddStaticRouteForm";
import DeleteStaticRouteForm from "@/app/subnets/views/SubnetDetails/StaticRoutes/DeleteStaticRouteform";
import EditStaticRouteForm from "@/app/subnets/views/SubnetDetails/StaticRoutes/EditStaticRouteForm";
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
  [SubnetActionTypes.ReserveStaticDHCPLease]: () => null,
  [SubnetActionTypes.EditStaticDHCPLease]: () => null,
  [SubnetActionTypes.DeleteDHCPLease]: DeleteDHCPLease,
};

const SubnetActionForms = ({
  subnetId,
  activeForm,
  setSidePanelContent,
  staticRouteId,
  macAddress,
}: SubnetActionProps): JSX.Element => {
  const FormComponent = activeForm ? FormComponents[activeForm] : () => null;

  return (
    <FormComponent
      activeForm={activeForm}
      macAddress={macAddress}
      setSidePanelContent={setSidePanelContent}
      staticRouteId={staticRouteId}
      subnetId={subnetId}
    />
  );
};

export default SubnetActionForms;
