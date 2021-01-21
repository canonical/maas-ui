import { DiskTypes } from "./types";

// From models/partition.py. This should ideally be available over the websocket.
// https://github.com/canonical-web-and-design/maas-ui/issues/1866
export const MIN_PARTITION_SIZE = 4 * 1024 * 1024;

export type RaidMode = {
  allowsSpares: boolean;
  calculateSize: (minSize: number, numActive: number) => number;
  label: string;
  level:
    | DiskTypes.RAID_0
    | DiskTypes.RAID_1
    | DiskTypes.RAID_5
    | DiskTypes.RAID_6
    | DiskTypes.RAID_10;
  minDevices: number;
};
// This should be made available over the websocket.
// https://github.com/canonical-web-and-design/maas-ui/issues/1866
export const RAID_MODES: RaidMode[] = [
  {
    allowsSpares: false,
    calculateSize: (minSize: number, numActive: number): number =>
      minSize * numActive,
    label: "RAID 0",
    level: DiskTypes.RAID_0,
    minDevices: 2,
  },
  {
    allowsSpares: true,
    calculateSize: (minSize: number, _: number): number => minSize,
    label: "RAID 1",
    level: DiskTypes.RAID_1,
    minDevices: 2,
  },
  {
    allowsSpares: true,
    calculateSize: (minSize: number, numActive: number): number =>
      minSize * (numActive - 1),
    label: "RAID 5",
    level: DiskTypes.RAID_5,
    minDevices: 3,
  },
  {
    allowsSpares: true,
    calculateSize: (minSize: number, numActive: number): number =>
      minSize * (numActive - 2),
    label: "RAID 6",
    level: DiskTypes.RAID_6,
    minDevices: 4,
  },
  {
    allowsSpares: true,
    calculateSize: (minSize: number, numActive: number): number =>
      (minSize * numActive) / 2,
    label: "RAID 10",
    level: DiskTypes.RAID_10,
    minDevices: 3,
  },
];
