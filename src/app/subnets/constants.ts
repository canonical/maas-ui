import { SubnetsColumns } from "./views/SubnetsList/SubnetsTable/constants";

export const SubnetForms = {
  Fabric: "Fabric",
  VLAN: "VLAN",
  Space: "Space",
  Subnet: "Subnet",
} as const;

export const SubnetsUrlParams = {
  By: "by",
  Q: "q",
};

export const subnetOptions = [
  {
    label: "Group by fabric",
    value: SubnetsColumns.FABRIC,
  },
  {
    label: "Group by space",
    value: SubnetsColumns.SPACE,
  },
];
