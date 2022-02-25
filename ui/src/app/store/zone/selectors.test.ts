import { ACTION_STATUS, ZONE_ACTIONS } from "./constants";
import zone from "./selectors";

import {
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneError as errorFactory,
  zoneGenericActions as genericActionsFactory,
  zoneModelAction as modelActionFactory,
  zoneModelActions as modelActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

it("can get all zones", () => {
  const items = [zoneFactory(), zoneFactory()];
  const state = rootStateFactory({
    zone: zoneStateFactory({
      items,
    }),
  });

  expect(zone.all(state)).toEqual(items);
});

it("can get zone errors", () => {
  const errors = [errorFactory(), errorFactory()];
  const state = rootStateFactory({
    zone: zoneStateFactory({
      errors,
    }),
  });

  expect(zone.errors(state)).toEqual(errors);
});

it("can get zone generic actions", () => {
  const genericActions = genericActionsFactory();
  const state = rootStateFactory({
    zone: zoneStateFactory({
      genericActions,
    }),
  });

  expect(zone.genericActions(state)).toEqual(genericActions);
});

it("can get zone model actions", () => {
  const modelActions = modelActionsFactory();
  const state = rootStateFactory({
    zone: zoneStateFactory({
      modelActions,
    }),
  });

  expect(zone.modelActions(state)).toEqual(modelActions);
});

it("can get the zone count", () => {
  const items = [zoneFactory(), zoneFactory()];
  const state = rootStateFactory({
    zone: zoneStateFactory({
      items,
    }),
  });

  expect(zone.count(state)).toEqual(items.length);
});

it("can get a zone by id", () => {
  const [thisZone, otherZone] = [
    zoneFactory({ id: 1 }),
    zoneFactory({ id: 2 }),
  ];
  const state = rootStateFactory({
    zone: zoneStateFactory({
      items: [thisZone, otherZone],
    }),
  });

  expect(zone.getById(state, 1)).toStrictEqual(thisZone);
});

it("can get a zone generic action's status", () => {
  const genericActions = genericActionsFactory({
    [ZONE_ACTIONS.fetch]: ACTION_STATUS.failed,
  });
  const state = rootStateFactory({
    zone: zoneStateFactory({
      genericActions,
    }),
  });

  expect(zone.getGenericActionStatus(state, ZONE_ACTIONS.fetch)).toBe(
    ACTION_STATUS.failed
  );
});

it("can get a zone's model action status", () => {
  const modelActions = modelActionsFactory({
    [ZONE_ACTIONS.update]: modelActionFactory({
      [ACTION_STATUS.processing]: [123],
    }),
  });
  const state = rootStateFactory({
    zone: zoneStateFactory({
      modelActions,
    }),
  });

  expect(zone.getModelActionStatus(state, 123, ZONE_ACTIONS.update)).toBe(
    ACTION_STATUS.processing
  );
});

it("can get the zone loading state", () => {
  const state = rootStateFactory({
    zone: zoneStateFactory({
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.processing,
      }),
    }),
  });

  expect(zone.loading(state)).toEqual(true);
});

it("can get the zone loaded state", () => {
  const state = rootStateFactory({
    zone: zoneStateFactory({
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.successful,
      }),
    }),
  });

  expect(zone.loaded(state)).toEqual(true);
});

it("can get the zone creating state", () => {
  const state = rootStateFactory({
    zone: zoneStateFactory({
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.create]: ACTION_STATUS.processing,
      }),
    }),
  });

  expect(zone.creating(state)).toEqual(true);
});

it("can get the zone created state", () => {
  const state = rootStateFactory({
    zone: zoneStateFactory({
      genericActions: genericActionsFactory({
        [ZONE_ACTIONS.create]: ACTION_STATUS.successful,
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
    errorFactory({ action: ZONE_ACTIONS.update, modelPK: 123 }),
    errorFactory({ action: ZONE_ACTIONS.delete, modelPK: 321 }),
    errorFactory({
      action: ZONE_ACTIONS.delete,
      modelPK: 123,
      error: latestErrorMessage,
    }),
    errorFactory({ action: ZONE_ACTIONS.delete, modelPK: 123 }),
  ];
  const state = rootStateFactory({
    zone: zoneStateFactory({
      errors: [
        otherActionError,
        otherModelError,
        latestActionError,
        nonLatestActionError,
      ],
    }),
  });

  expect(zone.getLatestActionError(state, ZONE_ACTIONS.delete, 123)).toEqual(
    latestErrorMessage
  );
});
