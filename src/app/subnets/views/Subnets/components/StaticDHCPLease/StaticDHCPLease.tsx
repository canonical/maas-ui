import type { ReactElement } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import {
  SubnetActionTypes,
  SubnetDetailsSidePanelViews,
} from "../../views/SubnetDetails/constants";

import { useSidePanel } from "@/app/base/side-panel-context";
import reservedIpSelectors from "@/app/store/reservedip/selectors";
import type { RootState } from "@/app/store/root/types";
import { useReservedIps } from "@/app/store/subnet/hooks";
import type { SubnetMeta } from "@/app/store/subnet/types";
import type { Subnet } from "@/app/store/subnet/types/base";
import StaticDHCPTable from "@/app/subnets/views/Subnets/components/StaticDHCPLease/StaticDHCPTable";

type StaticDHCPLeaseProps = {
  subnetId: Subnet[SubnetMeta.PK];
};

const StaticDHCPLease = ({ subnetId }: StaticDHCPLeaseProps): ReactElement => {
  const { setSidePanelContent } = useSidePanel();
  const staticDHCPLeases = useReservedIps(subnetId);
  const loading = useSelector((state: RootState) =>
    reservedIpSelectors.loading(state)
  );

  return (
    <>
      <MainToolbar>
        <MainToolbar.Title>Static DHCP leases</MainToolbar.Title>
        <MainToolbar.Controls>
          <Button
            appearance="positive"
            onClick={() => {
              setSidePanelContent({
                view: SubnetDetailsSidePanelViews[
                  SubnetActionTypes.ReserveDHCPLease
                ],
              });
            }}
          >
            Reserve static DHCP lease
          </Button>
        </MainToolbar.Controls>
      </MainToolbar>
      <StaticDHCPTable loading={loading} reservedIps={staticDHCPLeases} />
    </>
  );
};

export default StaticDHCPLease;
