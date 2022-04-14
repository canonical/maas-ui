import {
  getHasSyncFailed,
  getMachineFieldScopes,
  getTagCountsForMachines,
  isMachineDetails,
  shouldShowHardwareSyncStatus,
} from "./common";

import { PowerFieldScope } from "app/store/general/types";
import { NodeStatus } from "app/store/types/node";
import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  modelRef as modelRefFactory,
} from "testing/factories";

describe("common machine utils", () => {
  describe("isMachineDetails", () => {
    it("identifies machine details", () => {
      expect(isMachineDetails(machineDetailsFactory())).toBe(true);
    });

    it("handles a machine", () => {
      expect(isMachineDetails(machineFactory())).toBe(false);
    });

    it("handles no machine", () => {
      expect(isMachineDetails()).toBe(false);
    });

    it("handles null", () => {
      expect(isMachineDetails(null)).toBe(false);
    });
  });

  describe("getTagCountsForMachines", () => {
    it("gets the tag ids and counts", () => {
      const machines = [
        machineFactory({ tags: [1, 2, 3] }),
        machineFactory({ tags: [3, 1, 4] }),
      ];
      expect(getTagCountsForMachines(machines)).toStrictEqual(
        new Map([
          [1, 2],
          [2, 1],
          [3, 2],
          [4, 1],
        ])
      );
    });
  });

  describe("getMachineFieldScopes", () => {
    it("gets the field scopes for a machine in a pod", () => {
      const machine = machineFactory({ pod: modelRefFactory() });

      expect(getMachineFieldScopes(machine)).toStrictEqual([
        PowerFieldScope.NODE,
      ]);
    });

    it("gets the field scopes for a machine not in a pod", () => {
      const machine = machineFactory({ pod: undefined });

      expect(getMachineFieldScopes(machine)).toStrictEqual([
        PowerFieldScope.BMC,
        PowerFieldScope.NODE,
      ]);
    });
  });

  describe("getHasSyncFailed", () => {
    it("returns false if is_sync_healthy is true or undefined", () => {
      expect(
        getHasSyncFailed(machineDetailsFactory({ is_sync_healthy: true }))
      ).toBe(false);
      expect(
        getHasSyncFailed(machineDetailsFactory({ is_sync_healthy: undefined }))
      ).toBe(false);
    });
    it("returns true if is_sync_healthy is false", () => {
      expect(
        getHasSyncFailed(machineDetailsFactory({ is_sync_healthy: false }))
      ).toBe(true);
    });
  });

  describe("shouldShowHardwareSyncStatus", () => {
    it("returns false for deploying machines", () => {
      expect(
        shouldShowHardwareSyncStatus(
          machineDetailsFactory({
            status: NodeStatus.DEPLOYING,
            enable_hw_sync: true,
          })
        )
      ).toBe(false);
    });

    it("returns true for deployed machines with hardware sync enabled", () => {
      expect(
        shouldShowHardwareSyncStatus(
          machineDetailsFactory({
            status: NodeStatus.DEPLOYED,
            enable_hw_sync: true,
          })
        )
      ).toBe(true);
    });

    it("returns false for deployed machines with hardware sync disabled", () => {
      expect(
        shouldShowHardwareSyncStatus(
          machineDetailsFactory({
            status: NodeStatus.DEPLOYED,
            enable_hw_sync: false,
          })
        )
      ).toBe(false);
    });
  });
});
