import type { HardwareType } from "app/base/enum";
import type { TSFixMe } from "app/base/types";
import type {
  Disk,
  Machine,
  MachineNumaNode,
  NetworkInterface,
} from "app/store/machine/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export enum NodeDeviceBus {
  PCIE = 1,
  USB = 2,
}

export type NodeDevice = Model & {
  bus_number: number;
  bus: NodeDeviceBus;
  commissioning_driver: string;
  created: string;
  device_number: number;
  hardware_type: HardwareType;
  node_id: Machine["id"];
  numa_node_id: MachineNumaNode["index"];
  pci_address?: string;
  physical_blockdevice_id: Disk["id"] | null;
  physical_interface_id: NetworkInterface["id"] | null;
  product_id: string;
  product_name: string;
  updated: string;
  vendor_id: string;
  vendor_name: string;
};

export type NodeDeviceState = GenericState<NodeDevice, TSFixMe>;
