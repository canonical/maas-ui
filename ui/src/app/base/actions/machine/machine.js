const machine = {};

machine.fetch = () => {
  return {
    type: "FETCH_MACHINE",
    meta: {
      model: "machine",
      method: "list"
    }
  };
};

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

machine.cleanup = () => {
  return {
    type: "CLEANUP_MACHINE"
  };
};

export default machine;
