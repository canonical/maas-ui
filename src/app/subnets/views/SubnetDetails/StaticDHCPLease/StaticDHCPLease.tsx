import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import { SubnetActionTypes, SubnetDetailsSidePanelViews } from "../constants";

import { useSidePanel } from "@/app/base/side-panel-context";

const StaticDHCPLease = () => {
  const { setSidePanelContent } = useSidePanel();

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
    </>
  );
};

export default StaticDHCPLease;
