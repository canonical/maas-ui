export enum SubnetActionTypes {
  MapSubnet = "MapSubnet",
  EditBootArchitectures = "EditBootArchitectures",
  DeleteSubnet = "DeleteSubnet",
}

export const subnetActionLabels = {
  [SubnetActionTypes.MapSubnet]: "Map subnet",
  [SubnetActionTypes.EditBootArchitectures]: "Edit boot architectures",
  [SubnetActionTypes.DeleteSubnet]: "Delete subnet",
} as const;
