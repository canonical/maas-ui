import { ZONE_ACTIONS, ZONE_WEBSOCKET_METHODS } from "./constants";
import { actions as zoneActions } from "./slice";
import { ZoneMeta } from "./types";

it("can create an action for creating a zone", () => {
  expect(
    zoneActions[ZONE_ACTIONS.create]({
      description: "Welcome to the",
      name: "danger",
    })
  ).toEqual({
    type: `${ZoneMeta.MODEL}/${ZONE_ACTIONS.create}`,
    meta: {
      model: ZoneMeta.MODEL,
      method: ZONE_WEBSOCKET_METHODS.create,
    },
    payload: {
      params: {
        description: "Welcome to the",
        name: "danger",
      },
    },
  });
});

it("can create an action for fetching zones", () => {
  expect(zoneActions[ZONE_ACTIONS.fetch]()).toEqual({
    type: `${ZoneMeta.MODEL}/${ZONE_ACTIONS.fetch}`,
    meta: {
      model: ZoneMeta.MODEL,
      method: ZONE_WEBSOCKET_METHODS.list,
    },
    payload: null,
  });
});

it("can create an action for deleting a zone", () => {
  expect(zoneActions[ZONE_ACTIONS.delete]({ [ZoneMeta.PK]: 123 })).toEqual({
    type: `${ZoneMeta.MODEL}/${ZONE_ACTIONS.delete}`,
    meta: {
      model: ZoneMeta.MODEL,
      method: ZONE_WEBSOCKET_METHODS.delete,
      identifier: 123,
    },
    payload: {
      params: {
        [ZoneMeta.PK]: 123,
      },
    },
  });
});

it("can create an action for updating a zone", () => {
  expect(
    zoneActions[ZONE_ACTIONS.update]({
      [ZoneMeta.PK]: 321,
      description: "Goodbye to the",
      name: "danger",
    })
  ).toEqual({
    type: `${ZoneMeta.MODEL}/${ZONE_ACTIONS.update}`,
    meta: {
      model: ZoneMeta.MODEL,
      method: ZONE_WEBSOCKET_METHODS.update,
      identifier: 321,
    },
    payload: {
      params: {
        [ZoneMeta.PK]: 321,
        description: "Goodbye to the",
        name: "danger",
      },
    },
  });
});

it("can create an action for cleaning up zone state", () => {
  expect(zoneActions[ZONE_ACTIONS.cleanup]([ZONE_ACTIONS.delete])).toEqual({
    type: `${ZoneMeta.MODEL}/${ZONE_ACTIONS.cleanup}`,
    payload: [ZONE_ACTIONS.delete],
  });
});
