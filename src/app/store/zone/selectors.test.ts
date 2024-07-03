import { ZONE_ACTIONS } from "./constants";
import zone from "./selectors";

import { ACTION_STATUS } from "@/app/base/constants";
import * as factory from "@/testing/factories";

it("can get zone errors", () => {
  const errors = [factory.zoneError(), factory.zoneError()];
  const state = factory.rootState({
    zone: factory.zoneState({
      errors,
    }),
  });

  expect(zone.errors(state)).toEqual(errors);
});

it("can get zone generic actions", () => {
  const genericActions = factory.zoneGenericActions();
  const state = factory.rootState({
    zone: factory.zoneState({
      genericActions,
    }),
  });

  expect(zone.genericActions(state)).toEqual(genericActions);
});

it("can get zone model actions", () => {
  const modelActions = factory.zoneModelActions();
  const state = factory.rootState({
    zone: factory.zoneState({
      modelActions,
    }),
  });

  expect(zone.modelActions(state)).toEqual(modelActions);
});

it("can get a zone generic action's status", () => {
  const genericActions = factory.zoneGenericActions({
    [ZONE_ACTIONS.fetch]: ACTION_STATUS.error,
  });
  const state = factory.rootState({
    zone: factory.zoneState({
      genericActions,
    }),
  });

  expect(zone.getGenericActionStatus(state, ZONE_ACTIONS.fetch)).toBe(
    ACTION_STATUS.error
  );
});

it("can get a zone's model action status", () => {
  const modelActions = factory.zoneModelActions({
    [ZONE_ACTIONS.update]: factory.zoneModelAction({
      [ACTION_STATUS.loading]: [123],
    }),
  });
  const state = factory.rootState({
    zone: factory.zoneState({
      modelActions,
    }),
  });

  expect(zone.getModelActionStatus(state, ZONE_ACTIONS.update, 123)).toBe(
    ACTION_STATUS.loading
  );
});

it("can get the zone creating state", () => {
  const state = factory.rootState({
    zone: factory.zoneState({
      genericActions: factory.zoneGenericActions({
        [ZONE_ACTIONS.create]: ACTION_STATUS.loading,
      }),
    }),
  });

  expect(zone.creating(state)).toEqual(true);
});

it("can get the zone created state", () => {
  const state = factory.rootState({
    zone: factory.zoneState({
      genericActions: factory.zoneGenericActions({
        [ZONE_ACTIONS.create]: ACTION_STATUS.success,
      }),
    }),
  });

  expect(zone.created(state)).toEqual(true);
});

it("can get the latest error for an action", () => {
  const latestErrorMessage = "This is the latest error.";
  const [
    otherActionError,
    otherModelError,
    latestActionError,
    nonLatestActionError,
  ] = [
    factory.zoneError({ action: ZONE_ACTIONS.update, identifier: 123 }),
    factory.zoneError({ action: ZONE_ACTIONS.delete, identifier: 321 }),
    factory.zoneError({
      action: ZONE_ACTIONS.delete,
      identifier: 123,
      error: latestErrorMessage,
    }),
    factory.zoneError({ action: ZONE_ACTIONS.delete, identifier: 123 }),
  ];
  const state = factory.rootState({
    zone: factory.zoneState({
      errors: [
        otherActionError,
        otherModelError,
        latestActionError,
        nonLatestActionError,
      ],
    }),
  });

  expect(zone.getLatestError(state, ZONE_ACTIONS.delete, 123)).toEqual(
    latestErrorMessage
  );
});
