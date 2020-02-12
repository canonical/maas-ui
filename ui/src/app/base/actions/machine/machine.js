import { createStandardActions } from "app/utils/redux";

const machine = createStandardActions("machine");

machine.setPool = (systemId, poolId) => {
  return {
    type: "SET_MACHINE_POOL",
    meta: {
      model: "machine",
      method: "action"
    },
    payload: {
      params: {
        action: "set-pool",
        extra: {
          pool_id: poolId
        },
        system_id: systemId
      }
    }
  };
};

machine.setZone = (systemId, zoneId) => {
  return {
    type: "SET_MACHINE_ZONE",
    meta: {
      model: "machine",
      method: "action"
    },
    payload: {
      params: {
        action: "set-zone",
        extra: {
          zone_id: zoneId
        },
        system_id: systemId
      }
    }
  };
};

export default machine;
