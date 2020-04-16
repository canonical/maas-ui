import { createStandardActions } from "app/utils/redux";

const resourcepool = createStandardActions("resourcepool");

/**
 * Create a pool and attach machines to it.
 * @param {Object} pool - The pool details.
 * @param {Array} machines - A list of machine ids.
 */
resourcepool.createWithMachines = (pool, machines) => ({
  type: "CREATE_RESOURCEPOOL_WITH_MACHINES",
  payload: {
    params: {
      pool,
      machines,
    },
  },
});

export default resourcepool;
