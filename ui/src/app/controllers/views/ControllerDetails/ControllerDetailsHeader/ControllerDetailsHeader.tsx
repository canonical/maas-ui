import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom-v5-compat";

import NodeActionMenu from "app/base/components/NodeActionMenu";
import SectionHeader from "app/base/components/SectionHeader";
import ControllerHeaderForms from "app/controllers/components/ControllerHeaderForms";
import { ControllerHeaderViews } from "app/controllers/constants";
import type {
  ControllerHeaderContent,
  ControllerSetHeaderContent,
} from "app/controllers/types";
import controllerURLs from "app/controllers/urls";
import { getHeaderTitle } from "app/controllers/utils";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller } from "app/store/controller/types";
import { isControllerDetails } from "app/store/controller/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId: Controller["system_id"];
  headerContent: ControllerHeaderContent | null;
  setHeaderContent: ControllerSetHeaderContent;
};

const ControllerDetailsHeader = ({
  systemId,
  headerContent,
  setHeaderContent,
}: Props): JSX.Element => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );
  const { pathname } = useLocation();

  if (!controller) {
    return <SectionHeader loading />;
  }

  return (
    <SectionHeader
      subtitleLoading={!isControllerDetails(controller)}
      buttons={[
        <NodeActionMenu
          key="action-dropdown"
          nodeDisplay="controller"
          nodes={[controller]}
          onActionClick={(action) => {
            const view = Object.values(ControllerHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setHeaderContent({ view });
            }
          }}
        />,
      ]}
      tabLinks={[
        {
          label: "Summary",
          url: controllerURLs.controller.summary({ id: systemId }),
        },
        {
          label: "VLANs",
          url: controllerURLs.controller.vlans({ id: systemId }),
        },
        {
          label: "Network",
          url: controllerURLs.controller.network({ id: systemId }),
        },
        {
          label: "Storage",
          url: controllerURLs.controller.storage({ id: systemId }),
        },
        {
          label: "PCI devices",
          url: controllerURLs.controller.pciDevices({ id: systemId }),
        },
        {
          label: "USB",
          url: controllerURLs.controller.usbDevices({ id: systemId }),
        },
        {
          label: "Commissioning",
          url: controllerURLs.controller.commissioning({ id: systemId }),
        },
        {
          label: "Logs",
          url: controllerURLs.controller.logs({ id: systemId }),
        },
        {
          label: "Configuration",
          url: controllerURLs.controller.configuration({ id: systemId }),
        },
      ].map((link) => ({
        active: pathname.startsWith(link.url),
        component: Link,
        label: link.label,
        to: link.url,
      }))}
      title={getHeaderTitle(controller.fqdn, headerContent)}
      headerContent={
        headerContent ? (
          <ControllerHeaderForms
            controllers={[controller]}
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
            viewingDetails
          />
        ) : null
      }
    />
  );
};

export default ControllerDetailsHeader;
