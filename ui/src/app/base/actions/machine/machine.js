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

export default machine;
