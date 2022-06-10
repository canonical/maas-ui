import eventSelectors from "./selectors";

import {
  eventRecord as eventRecordFactory,
  eventState as eventStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("eventSelectors selectors", () => {
  it("can get all items", () => {
    const items = [eventRecordFactory(), eventRecordFactory()];
    const state = rootStateFactory({
      event: eventStateFactory({
        items,
      }),
    });
    expect(eventSelectors.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      event: eventStateFactory({
        loading: true,
      }),
    });
    expect(eventSelectors.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      event: eventStateFactory({
        loaded: true,
      }),
    });
    expect(eventSelectors.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      event: eventStateFactory({
        saving: true,
      }),
    });
    expect(eventSelectors.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      event: eventStateFactory({
        saved: true,
      }),
    });
    expect(eventSelectors.saved(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      event: eventStateFactory({
        errors: "Unable to get events",
      }),
    });
    expect(eventSelectors.errors(state)).toStrictEqual("Unable to get events");
  });

  it("can get an event by id", () => {
    const items = [
      eventRecordFactory({ id: 101 }),
      eventRecordFactory({ id: 123 }),
    ];
    const state = rootStateFactory({
      event: eventStateFactory({
        items,
      }),
    });
    expect(eventSelectors.getById(state, 101)).toStrictEqual(items[0]);
  });

  it("can get events for a node", () => {
    const items = [
      eventRecordFactory({ id: 101, node_id: 1 }),
      eventRecordFactory({ id: 123, node_id: 2 }),
      eventRecordFactory({ id: 124, node_id: 1 }),
    ];
    const state = rootStateFactory({
      event: eventStateFactory({
        items,
      }),
    });
    expect(eventSelectors.getByNodeId(state, 1)).toStrictEqual([
      items[0],
      items[2],
    ]);
  });
});
