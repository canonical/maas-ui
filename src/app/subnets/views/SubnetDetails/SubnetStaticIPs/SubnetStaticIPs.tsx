import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import { SubnetActionTypes, SubnetDetailsSidePanelViews } from "../constants";

import { useSidePanel } from "@/app/base/side-panel-context";

const SubnetStaticIPs = () => {
  const { setSidePanelContent } = useSidePanel();

  return (
    <>
      <MainToolbar>
        <MainToolbar.Title>Static IPs</MainToolbar.Title>
        <MainToolbar.Controls>
          <Button
            appearance="positive"
            onClick={() =>
              setSidePanelContent({
                view: SubnetDetailsSidePanelViews[
                  SubnetActionTypes.ReserveStaticIP
                ],
              })
            }
          >
            Reserve static IP
          </Button>
        </MainToolbar.Controls>
      </MainToolbar>
    </>
  );
};

export default SubnetStaticIPs;
