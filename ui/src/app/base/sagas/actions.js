import { call } from "redux-saga/effects";

import {
  machine as machineActions,
  resourcepool as resourcePoolActions,
} from "app/base/actions";

/**
 * Generate functions that will use the response to create the dispatchable
 * action to set the pool for each machine.
 * @param {Array} machines - A list of machine ids.
 * @returns {Array} The list of action creator functions.
 */
export const generateActionCreators = (machines) =>
  machines.map((machineID) => (result) =>
    machineActions.setPool(machineID, result.id)
  );

/**
 * Handle creating a pool and then attaching machines to that pool.
 * @param {Object} socketClient - The websocket client instance.
 * @param {Function} sendMessage - The saga that handles sending websocket messages.
 * @param {Object} action - The redux action with pool and machine data.
 */
export function* createPoolWithMachines(
  socketClient,
  sendMessage,
  { payload }
) {
  const { machines, pool } = payload.params;
  const actionCreators = yield call(generateActionCreators, machines);
  // Send the initial action via the websocket.
  yield call(
    sendMessage,
    socketClient,
    resourcePoolActions.create(pool),
    actionCreators
  );
}

// Sagas to be handled by the websocket channel.
export default [
  {
    action: "CREATE_RESOURCEPOOL_WITH_MACHINES",
    method: createPoolWithMachines,
  },
];
