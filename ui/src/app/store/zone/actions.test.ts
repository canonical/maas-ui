import {
  ZONE_ACTIONS,
  ZONE_MODEL,
  ZONE_PK,
  ZONE_WEBSOCKET_METHODS,
} from "./constants";
import { actions as zoneActions } from "./slice";

it("can create an action for creating a zone", () => {
  expect(
    zoneActions[ZONE_ACTIONS.create]({
      description: "Welcome to the",
      name: "danger",
    })
  ).toEqual({
    type: `${ZONE_MODEL}/${ZONE_ACTIONS.create}`,
    meta: {
      model: ZONE_MODEL,
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
    type: `${ZONE_MODEL}/${ZONE_ACTIONS.fetch}`,
    meta: {
      model: ZONE_MODEL,
      method: ZONE_WEBSOCKET_METHODS.list,
    },
    payload: null,
  });
});

it("can create an action for deleting a zone", () => {
  expect(zoneActions[ZONE_ACTIONS.delete]({ [ZONE_PK]: 123 })).toEqual({
    type: `${ZONE_MODEL}/${ZONE_ACTIONS.delete}`,
    meta: {
      model: ZONE_MODEL,
      method: ZONE_WEBSOCKET_METHODS.delete,
      modelPK: 123,
    },
    payload: {
      params: {
        [ZONE_PK]: 123,
      },
    },
  });
});

it("can create an action for updating a zone", () => {
  expect(
    zoneActions[ZONE_ACTIONS.update]({
      [ZONE_PK]: 321,
      description: "Goodbye to the",
      name: "danger",
    })
  ).toEqual({
    type: `${ZONE_MODEL}/${ZONE_ACTIONS.update}`,
    meta: {
      model: ZONE_MODEL,
      method: ZONE_WEBSOCKET_METHODS.update,
      modelPK: 321,
    },
    payload: {
      params: {
        [ZONE_PK]: 321,
        description: "Goodbye to the",
        name: "danger",
      },
    },
  });
});

it("can create an action for cleaning up zone state", () => {
  expect(zoneActions[ZONE_ACTIONS.cleanup]()).toEqual({
    type: `${ZONE_MODEL}/${ZONE_ACTIONS.cleanup}`,
    payload: undefined,
  });
});
