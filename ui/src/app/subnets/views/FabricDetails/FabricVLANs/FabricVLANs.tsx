import { useEffect } from "react";

import { Strip, MainTable } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import SpaceLink from "app/base/components/SpaceLink";
import SubnetLink from "app/base/components/SubnetLink";
import VLANLink from "app/base/components/VLANLink";
import type { Fabric } from "app/store/fabric/types";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import type { Space } from "app/store/space/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";

type Columns = {
  available: string | null;
  space: Space | undefined;
  subnet: Subnet | null;
  vlan: VLAN;
};

const getAvailableIPs = (subnet: Subnet | null | undefined): string => {
  if (!subnet) {
    return "Unconfigured";
  } else {
    return `${subnet?.statistics?.available_string}`;
  }
};

const getSpaceById = (
  spaces: Space[],
  spaceId: Space["id"] | null
): Space | undefined => {
  return spaces.find((space) => space?.id === spaceId);
};

const getSubnetsInVLAN = (subnets: Subnet[], vlanId: VLAN["id"]): Subnet[] =>
  subnets.filter((subnet) => subnet.vlan === vlanId);

const getVLANsInFabric = (vlans: VLAN[], fabricId: Fabric["id"]): VLAN[] =>
  vlans.filter((vlan) => vlan.fabric === fabricId);

const getByFabric = (
  data: { subnets: Subnet[]; vlans: VLAN[]; spaces: Space[] },
  fabric: Fabric
) => {
  const rows: Columns[] = [];

  const fabricHasVlans = fabric.vlan_ids.length > 0;

  if (fabricHasVlans) {
    const vlansInFabric = getVLANsInFabric(data.vlans, fabric.id);

    vlansInFabric.forEach((vlan) => {
      const subnetsInVlan = getSubnetsInVLAN(data.subnets, vlan.id);
      const vlanHasSubnets = subnetsInVlan.length > 0;

      let space;

      if (!vlanHasSubnets) {
        space = getSpaceById(data.spaces, vlan.space);
        rows.push({ space, vlan, available: null, subnet: null });
      } else {
        subnetsInVlan.forEach((subnet) => {
          space = getSpaceById(data.spaces, subnet.space);
          const available = getAvailableIPs(subnet);
          rows.push({ available, space, subnet, vlan });
        });
      }
    });
  }

  return rows;
};

const FabricVLANs = ({ fabric }: { fabric: Fabric }): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(vlanActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(spaceActions.fetch());
  }, [dispatch]);

  const vlans = useSelector(vlanSelectors.vlanState);
  const subnets = useSelector(subnetSelectors.subnetState);
  const spaces = useSelector(spaceSelectors.spaceState);

  const data = getByFabric(
    {
      spaces: spaces.items,
      subnets: subnets.items,
      vlans: vlans.items,
    },
    fabric
  );

  return (
    <Strip shallow>
      <h2 className="p-heading--4">VLANs on this fabric</h2>
      <MainTable
        headers={[
          {
            content: "VLAN",
          },
          {
            content: "Subnet",
          },
          {
            content: "Available",
          },
          {
            content: "Space",
          },
        ]}
        rows={data.map((columns: Columns) => {
          return {
            columns: [
              {
                content: <VLANLink id={columns?.vlan?.id} />,
              },
              {
                content: <SubnetLink id={columns?.subnet?.id} />,
              },
              {
                content: columns?.available,
              },
              {
                content: <SpaceLink id={columns?.space?.id} />,
              },
            ],
          };
        })}
      />
    </Strip>
  );
};

export default FabricVLANs;
