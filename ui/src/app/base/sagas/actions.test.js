import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";

import { actions as resourcePoolActions } from "app/store/resourcepool";
import {
  createPoolWithMachines,
  generateMachinePoolActionCreators,
} from "./actions";

jest.mock("../../../websocket-client");

describe("websocket sagas", () => {
  it("can send a message to create a pool then attach machines", () => {
    const socketClient = jest.fn();
    const sendMessage = jest.fn();
    const actionCreators = [jest.fn()];
    const pool = { name: "pool1", description: "a pool" };
    const action = { payload: { params: { machines: ["machine1"], pool } } };
    return expectSaga(createPoolWithMachines, socketClient, sendMessage, action)
      .provide([
        [matchers.call.fn(generateMachinePoolActionCreators), actionCreators],
      ])
      .call(
        sendMessage,
        socketClient,
        resourcePoolActions.create(pool),
        actionCreators
      )
      .run();
  });
});
