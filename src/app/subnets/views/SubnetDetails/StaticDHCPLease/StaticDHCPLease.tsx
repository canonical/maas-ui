import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";
import { array } from "cooky-cutter";

import { SubnetActionTypes, SubnetDetailsSidePanelViews } from "../constants";

import { useSidePanel } from "@/app/base/side-panel-context";
import StaticDHCPTable from "@/app/subnets/views/SubnetDetails/StaticDHCPLease/StaticDHCPTable";
import { staticDHCPLease } from "@/testing/factories/subnet";

const StaticDHCPLease = () => {
  const { setSidePanelContent } = useSidePanel();
  const getMockStaticDHCPLeases = array(staticDHCPLease, 5);

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
                  SubnetActionTypes.ReserveStaticDHCPLease
                ],
              })
            }
          >
            Reserve static DHCP lease
          </Button>
        </MainToolbar.Controls>
      </MainToolbar>
      <StaticDHCPTable staticDHCPLeases={getMockStaticDHCPLeases()} />
    </>
  );
};

export default StaticDHCPLease;
