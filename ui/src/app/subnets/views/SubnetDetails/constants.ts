export enum SubnetActionTypes {
  MapSubnet = "MapSubnet",
  EditBootArchitectures = "EditBootArchitectures",
  DeleteSubnet = "DeleteSubnet",
}

export const subnetActionLabels = {
  [SubnetActionTypes.MapSubnet]: "Map Subnet",
  [SubnetActionTypes.EditBootArchitectures]: "Edit Boot Architectures",
  [SubnetActionTypes.DeleteSubnet]: "Delete Subnet",
} as const;
