import { createStandardActions } from "app/utils/redux";

const machine = createStandardActions("machine");

machine.create = params => {
  return {
    type: "CREATE_MACHINE",
    meta: {
      model: "machine",
      method: "create"
    },
    payload: {
      params
    }
  };
};

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

machine.turnOff = systemId => {
  return {
    type: "TURN_MACHINE_OFF",
    meta: {
      model: "machine",
      method: "action"
    },
    payload: {
      params: {
        action: "off",
        system_id: systemId
      }
    }
  };
};

machine.turnOn = systemId => {
  return {
    type: "TURN_MACHINE_ON",
    meta: {
      model: "machine",
      method: "action"
    },
    payload: {
      params: {
        action: "on",
        system_id: systemId
      }
    }
  };
};

machine.checkPower = systemId => {
  return {
    type: "CHECK_MACHINE_POWER",
    meta: {
      model: "machine",
      method: "check_power"
    },
    payload: {
      params: {
        system_id: systemId
      }
    }
  };
};

machine.cleanup = () => {
  return {
    type: "CLEANUP_MACHINE"
  };
};

export default machine;
