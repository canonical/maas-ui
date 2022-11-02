import type {
  CreateParams,
  Device,
  DeviceIpAssignment,
} from "app/store/device/types";
import type { Domain } from "app/store/domain/types";
import type { Zone } from "app/store/zone/types";

type CreateParamsInterface = CreateParams["interfaces"][0];

export type AddDeviceInterface = {
  id: number;
  ip_address: NonNullable<CreateParamsInterface["ip_address"]>;
  ip_assignment: DeviceIpAssignment;
  mac: CreateParamsInterface["mac"];
  name: NonNullable<CreateParamsInterface["name"]>;
  subnet: NonNullable<CreateParamsInterface["subnet"]> | "";
};

export type AddDeviceValues = {
  domain: Domain["name"];
  hostname: Device["hostname"];
  interfaces: (Omit<AddDeviceInterface, "subnet"> & { subnet: string })[];
  zone: Zone["name"];
};
