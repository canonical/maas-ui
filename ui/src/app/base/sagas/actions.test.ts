import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";

import WebSocketClient from "../../../websocket-client";

import {
  createPoolWithMachines,
  generateMachinePoolActionCreators,
  generateNextUpdateRecordAction,
  updateDomainRecord,
} from "./actions";

import { actions as domainActions } from "app/store/domain";
import { RecordType } from "app/store/domain/types";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import { domainResource as resourceFactory } from "testing/factories";

jest.mock("../../../websocket-client");

describe("websocket sagas", () => {
  it("can send a message to create a pool then attach machines", () => {
    const socketClient = new WebSocketClient();
    const sendMessage = jest.fn();
    const actionCreators = [jest.fn()];
    const pool = { name: "pool1", description: "a pool" };
    const action = {
      type: "resourcepoo/createWithMachines",
      payload: { params: { machineIDs: ["machine1"], pool } },
    };
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

  it("can send a message to update a DNS resource then update the record", () => {
    const socketClient = new WebSocketClient();
    const sendMessage = jest.fn();
    const actionCreators = [jest.fn()];
    const resource = resourceFactory({
      dnsdata_id: 1,
      dnsresource_id: 2,
      name: "old-name",
      rrdata: "192.168.1.1",
      rrtype: RecordType.A,
    });
    const params = {
      domain: 3,
      name: "new-name",
      resource,
      rrdata: "192.168.1.1, 192.168.1.2",
      ttl: 4,
    };
    const action = { payload: { params }, type: "domain/updateRecord" };
    return expectSaga(updateDomainRecord, socketClient, sendMessage, action)
      .provide([
        [matchers.call.fn(generateNextUpdateRecordAction), actionCreators],
      ])
      .call(
        sendMessage,
        socketClient,
        domainActions.updateDNSResource({
          dnsresource_id: 2,
          domain: 3,
          name: "new-name",
        }),
        actionCreators
      )
      .run();
  });
});
