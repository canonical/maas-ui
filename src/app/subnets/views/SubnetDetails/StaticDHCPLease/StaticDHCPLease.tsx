import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import { SubnetActionTypes, SubnetDetailsSidePanelViews } from "../constants";

import { useSidePanel } from "@/app/base/side-panel-context";
import { useReservedIps } from "@/app/store/subnet/hooks";
import type { SubnetMeta } from "@/app/store/subnet/types";
import type { Subnet } from "@/app/store/subnet/types/base";
import StaticDHCPTable from "@/app/subnets/views/SubnetDetails/StaticDHCPLease/StaticDHCPTable";

type StaticDHCPLeaseProps = {
  subnetId: Subnet[SubnetMeta.PK];
};

const StaticDHCPLease = ({ subnetId }: StaticDHCPLeaseProps) => {
  const { setSidePanelContent } = useSidePanel();
  const staticDHCPLeases = useReservedIps(subnetId);

  return (
    <>
      <MainToolbar>
        <MainToolbar.Title>Static DHCP leases</MainToolbar.Title>
        <MainToolbar.Controls>
          <Button
            appearance="positive"
            onClick={() =>
              setSidePanelContent({
                view: SubnetDetailsSidePanelViews[
                  SubnetActionTypes.ReserveDHCPLease
                ],
              })
            }
          >
            Reserve static DHCP lease
          </Button>
        </MainToolbar.Controls>
      </MainToolbar>
      <StaticDHCPTable reservedIps={staticDHCPLeases} />
    </>
  );
};

export default StaticDHCPLease;
