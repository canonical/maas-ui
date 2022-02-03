import { useEffect, useState } from "react";

import { MainTable } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import SpaceLink from "app/base/components/SpaceLink";
import SubnetLink from "app/base/components/SubnetLink";
import TitledSection from "app/base/components/TitledSection";
import VLANLink from "app/base/components/VLANLink";
import type { Fabric } from "app/store/fabric/types";
import { actions as spaceActions } from "app/store/space";
import spaceSelectors from "app/store/space/selectors";
import type { Space } from "app/store/space/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { getSubnetsInVLAN } from "app/store/subnet/utils";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { getVLANsInFabric } from "app/store/vlan/utils";

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
  const [data, setData] = useState<Columns[]>([]);
  const dispatch = useDispatch();
  const vlans = useSelector(vlanSelectors.vlanState);
  const subnets = useSelector(subnetSelectors.subnetState);
  const spaces = useSelector(spaceSelectors.spaceState);

  useEffect(() => {
    dispatch(vlanActions.fetch());
    dispatch(subnetActions.fetch());
    dispatch(spaceActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    setData(
      getByFabric(
        {
          spaces: spaces.items,
          subnets: subnets.items,
          vlans: vlans.items,
        },
        fabric
      )
    );
  }, [spaces, subnets, vlans, fabric]);

  return (
    <TitledSection title="VLANs on this fabric">
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
    </TitledSection>
  );
};

export default FabricVLANs;
