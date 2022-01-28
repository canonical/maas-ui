import { generateNewURL } from "@maas-ui/maas-ui-shared";
import type { LocationDescriptorObject } from "history";

import type { GroupByKey } from "./views/SubnetsList/SubnetsTable/types";

import type { Fabric, FabricMeta } from "app/store/fabric/types";
import type { Space, SpaceMeta } from "app/store/space/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import { argPath, isId } from "app/utils";

const urls = {
  index: ({ by }: { by?: GroupByKey } = {}): string =>
    by ? `/networks?by=${by}` : "/networks",
  fabric: {
    index: argPath<{ id: Fabric[FabricMeta.PK] }>("/fabric/:id"),
  },
  space: {
    index: argPath<{ id: Space[SpaceMeta.PK] }>("/space/:id"),
  },
  subnet: {
    index: argPath<{ id: Subnet[SubnetMeta.PK] }>("/subnet/:id"),
  },
  vlan: {
    index: argPath<{ id: VLAN[VLANMeta.PK] }>("/vlan/:id"),
  },
};

const getFabricLink = (id?: Fabric["id"]): string | null =>
  isId(id) ? generateNewURL(`/fabric/${id}`) : null;
const getSpaceLink = (id?: Space["id"]): string | null =>
  isId(id) ? generateNewURL(`/space/${id}`) : null;
const getVLANLink = (id?: VLAN["id"]): string | null =>
  isId(id) ? generateNewURL(`/vlan/${id}`) : null;
const getSubnetLink = (id?: Subnet["id"]): string | null =>
  isId(id) ? generateNewURL(`/subnet/${id}`) : null;
const getNetworksLocation = ({
  by,
}: { by?: GroupByKey } = {}): LocationDescriptorObject => ({
  pathname: "/networks",
  search: by ? `?by=${by}` : "",
});

export default urls;
export {
  getFabricLink,
  getSpaceLink,
  getVLANLink,
  getSubnetLink,
  getNetworksLocation,
};
