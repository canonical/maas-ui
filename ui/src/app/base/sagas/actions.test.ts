import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";

import WebSocketClient from "../../../websocket-client";

import {
  createPoolWithMachines,
  deleteDomainRecord,
  generateMachinePoolActionCreators,
  generateNextDeleteRecordAction,
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

  it("can send a message to update an address record then update the DNS resource", () => {
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
      rrset: resource,
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
        domainActions.updateAddressRecord({
          address_ttl: 4,
          domain: 3,
          ip_addresses: ["192.168.1.1", "192.168.1.2"],
          name: "new-name",
          previous_name: "old-name",
          previous_rrdata: "192.168.1.1",
        }),
        actionCreators
      )
      .run();
  });

  it("can send a message to update a DNS resource for 'A record' when rrdata is unchanged", () => {
    const socketClient = new WebSocketClient();
    const sendMessage = jest.fn();
    const actionCreators = [jest.fn()];
    const resource = resourceFactory({
      dnsdata_id: 1,
      dnsresource_id: 2,
      name: "old-name",
      rrdata: "old-rrdata",
      rrtype: RecordType.A,
    });
    const params = {
      domain: 3,
      name: "new-name",
      rrset: resource,
      rrdata: resource.rrdata,
      ttl: resource.ttl,
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

  it("can send a message to update a non-address record then update the DNS resource", () => {
    const socketClient = new WebSocketClient();
    const sendMessage = jest.fn();
    const actionCreators = [jest.fn()];
    const resource = resourceFactory({
      dnsdata_id: 1,
      dnsresource_id: 2,
      name: "old-name",
      rrdata: "old-rrdata",
      rrtype: RecordType.TXT,
    });
    const params = {
      domain: 3,
      name: "new-name",
      rrset: resource,
      rrdata: "new-rrdata",
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
        domainActions.updateDNSData({
          dnsdata_id: 1,
          dnsresource_id: 2,
          domain: 3,
          rrdata: "new-rrdata",
          ttl: 4,
        }),
        actionCreators
      )
      .run();
  });

  it("can send a message to delete an address record then delete the DNS resource", () => {
    const socketClient = new WebSocketClient();
    const sendMessage = jest.fn();
    const actionCreators = [jest.fn()];
    const resource = resourceFactory({
      dnsdata_id: 1,
      dnsresource_id: 2,
      name: "name",
      rrdata: "192.168.1.1",
      rrtype: RecordType.A,
    });
    const params = {
      deleteResource: true,
      domain: 3,
      rrset: resource,
    };
    const action = { payload: { params }, type: "domain/deleteRecord" };
    return expectSaga(deleteDomainRecord, socketClient, sendMessage, action)
      .provide([
        [matchers.call.fn(generateNextDeleteRecordAction), actionCreators],
      ])
      .call(
        sendMessage,
        socketClient,
        domainActions.deleteAddressRecord({
          dnsresource_id: 2,
          domain: 3,
          rrdata: "192.168.1.1",
        }),
        actionCreators
      )
      .run();
  });

  it("can send a message to delete a non-address record then delete the DNS resource", () => {
    const socketClient = new WebSocketClient();
    const sendMessage = jest.fn();
    const actionCreators = [jest.fn()];
    const resource = resourceFactory({
      dnsdata_id: 1,
      dnsresource_id: 2,
      name: "name",
      rrdata: "rrdata",
      rrtype: RecordType.TXT,
    });
    const params = {
      deleteResource: true,
      domain: 3,
      rrset: resource,
    };
    const action = { payload: { params }, type: "domain/deleteRecord" };
    return expectSaga(deleteDomainRecord, socketClient, sendMessage, action)
      .provide([
        [matchers.call.fn(generateNextDeleteRecordAction), actionCreators],
      ])
      .call(
        sendMessage,
        socketClient,
        domainActions.deleteDNSData({
          dnsdata_id: 1,
          domain: 3,
        }),
        actionCreators
      )
      .run();
  });
});
