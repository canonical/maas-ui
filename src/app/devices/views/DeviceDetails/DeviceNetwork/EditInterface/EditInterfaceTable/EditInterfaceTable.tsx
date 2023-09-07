import { MainTable, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TableHeader from "app/base/components/TableHeader";
import DHCPColumn from "app/base/components/node/networking/DHCPColumn";
import FabricColumn from "app/base/components/node/networking/FabricColumn";
import NameColumn from "app/base/components/node/networking/NameColumn";
import SubnetColumn from "app/base/components/node/networking/SubnetColumn";
import { useFetchActions } from "app/base/hooks";
import deviceSelectors from "app/store/device/selectors";
import type {
  Device,
  DeviceMeta,
  DeviceNetworkInterface,
} from "app/store/device/types";
import { isDeviceDetails } from "app/store/device/utils";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { RootState } from "app/store/root/types";
import type { NetworkLink } from "app/store/types/node";
import {
  getInterfaceIPAddress,
  getInterfaceTypeText,
  getLinkFromNic,
  getLinkModeDisplay,
} from "app/store/utils";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";

type Props = {
  linkId?: NetworkLink["id"] | null;
  nicId?: DeviceNetworkInterface["id"] | null;
  systemId: Device[DeviceMeta.PK];
};

const EditInterfaceTable = ({
  linkId,
  nicId,
  systemId,
}: Props): JSX.Element => {
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const fabrics = useSelector(fabricSelectors.all);
  const vlans = useSelector(vlanSelectors.all);
  const nic = useSelector((state: RootState) =>
    deviceSelectors.getInterfaceById(state, systemId, nicId, linkId)
  );
  const link = getLinkFromNic(nic, linkId);

  useFetchActions([fabricActions.fetch, vlanActions.fetch]);

  if (!isDeviceDetails(device) || !nic) {
    return <Spinner text="Loading..." />;
  }
  const typeDisplay = getInterfaceTypeText(device, nic, link);
  return (
    <MainTable
      headers={[
        {
          content: (
            <div>
              <TableHeader>Name</TableHeader>
              <TableHeader>Mac</TableHeader>
            </div>
          ),
        },
        {
          content: <TableHeader>Type</TableHeader>,
        },
        {
          content: (
            <div>
              <TableHeader>Fabric</TableHeader>
              <TableHeader>Vlan</TableHeader>
            </div>
          ),
        },
        {
          content: <TableHeader>Subnet</TableHeader>,
        },
        {
          content: <TableHeader>IP address</TableHeader>,
        },
        {
          content: <TableHeader>IP mode</TableHeader>,
        },
        {
          content: (
            <TableHeader className="p-double-row__header-spacer">
              DHCP
            </TableHeader>
          ),
        },
      ]}
      rows={[
        {
          columns: [
            {
              content: <NameColumn link={link} nic={nic} node={device} />,
            },
            {
              content: typeDisplay,
            },
            {
              content: <FabricColumn link={link} nic={nic} node={device} />,
            },
            {
              content: <SubnetColumn link={link} nic={nic} node={device} />,
            },
            {
              content: (
                <span data-testid="ip-address">
                  {getInterfaceIPAddress(device, fabrics, vlans, nic, link)}
                </span>
              ),
            },
            {
              content: (
                <span data-testid="ip-mode">{getLinkModeDisplay(link)}</span>
              ),
            },
            {
              content: <DHCPColumn nic={nic} />,
            },
          ],
          key: systemId,
        },
      ]}
    />
  );
};

export default EditInterfaceTable;
