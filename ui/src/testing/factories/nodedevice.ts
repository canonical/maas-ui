import { extend } from "cooky-cutter";

import { model } from "./model";

import { HardwareType } from "app/base/enum";
import type { NodeDevice } from "app/store/nodedevice/types";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { Model } from "app/store/types/model";

export const nodeDevice = extend<Model, NodeDevice>(model, {
  bus_number: 0,
  bus: NodeDeviceBus.PCIE,
  commissioning_driver: "pcieport",
  created: "Wed, 06 Jan. 2021 02:24:54",
  device_number: 1,
  hardware_type: HardwareType.Node,
  node_id: 0,
  numa_node_id: 0,
  pci_address: "0000:00:00.0",
  physical_blockdevice_id: null,
  physical_interface_id: null,
  product_id: "def456",
  product_name: "Product name",
  updated: "Wed, 06 Jan. 2021 02:24:54",
  vendor_id: "abc123",
  vendor_name: "Vendor name",
});
