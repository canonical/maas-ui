import DeleteSubnet from "./components/DeleteSubnet";
import EditBootArchitectures from "./components/EditBootArchitectures";
import MapSubnet from "./components/MapSubnet";

import ReservedRangeDeleteForm from "@/app/subnets/components/ReservedRangeDeleteForm";
import ReservedRangeForm from "@/app/subnets/components/ReservedRangeForm";
import DeleteDHCPLease from "@/app/subnets/views/SubnetDetails/StaticDHCPLease/DeleteDHCPLease";
import ReserveDHCPLease from "@/app/subnets/views/SubnetDetails/StaticDHCPLease/ReserveDHCPLease";
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
  ({
    activeForm,
    setSidePanelContent,
  }: SubnetActionProps) => React.ReactElement | null
> = {
  [SubnetActionTypes.MapSubnet]: MapSubnet,
  [SubnetActionTypes.EditBootArchitectures]: EditBootArchitectures,
  [SubnetActionTypes.DeleteSubnet]: DeleteSubnet,
  [SubnetActionTypes.AddStaticRoute]: AddStaticRouteForm,
  [SubnetActionTypes.EditStaticRoute]: EditStaticRouteForm,
  [SubnetActionTypes.DeleteStaticRoute]: DeleteStaticRouteForm,
  [SubnetActionTypes.ReserveRange]: ReservedRangeForm,
  [SubnetActionTypes.DeleteReservedRange]: ReservedRangeDeleteForm,
  [SubnetActionTypes.ReserveDHCPLease]: ReserveDHCPLease,
  [SubnetActionTypes.EditDHCPLease]: ReserveDHCPLease,
  [SubnetActionTypes.DeleteDHCPLease]: DeleteDHCPLease,
};

const SubnetActionForms = ({
  subnetId,
  activeForm,
  setSidePanelContent,
  staticRouteId,
  reservedIpId,
}: SubnetActionProps): React.ReactElement => {
  const FormComponent = activeForm ? FormComponents[activeForm] : () => null;

  return (
    <FormComponent
      activeForm={activeForm}
      reservedIpId={reservedIpId}
      setSidePanelContent={setSidePanelContent}
      staticRouteId={staticRouteId}
      subnetId={subnetId}
    />
  );
};

export default SubnetActionForms;
