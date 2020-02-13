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

const generateMachineAction = (type, action, systemId, extra) => ({
  type,
  meta: {
    model: "machine",
    method: "action"
  },
  payload: {
    params: {
      action,
      extra,
      system_id: systemId
    }
  }
});

machine.setPool = (systemId, poolId) =>
  generateMachineAction("SET_MACHINE_POOL", "set-pool", systemId, {
    pool_id: poolId
  });

machine.setZone = (systemId, zoneId) =>
  generateMachineAction("SET_MACHINE_ZONE", "set-zone", systemId, {
    zone_id: zoneId
  });

machine.turnOff = systemId =>
  generateMachineAction("TURN_MACHINE_OFF", "off", systemId);

machine.turnOn = systemId =>
  generateMachineAction("TURN_MACHINE_ON", "on", systemId);

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

machine.acquire = systemId =>
  generateMachineAction("ACQUIRE_MACHINE", "acquire", systemId);

machine.release = systemId =>
  generateMachineAction("RELEASE_MACHINE", "release", systemId);

machine.cleanup = () => {
  return {
    type: "CLEANUP_MACHINE"
  };
};

export default machine;
