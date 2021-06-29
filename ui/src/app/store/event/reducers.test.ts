import reducers, { actions } from "./slice";

import {
  eventRecord as eventRecordFactory,
  eventState as eventStateFactory,
} from "testing/factories";

describe("eventRecord reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  describe("fetch", () => {
    it("reduces fetch", () => {
      expect(reducers(undefined, actions.fetchStart())).toEqual({
        errors: null,
        items: [],
        loaded: false,
        loading: true,
        saved: false,
        saving: false,
      });
    });

    it("reduces fetchSuccess", () => {
      const eventState = eventStateFactory({
        items: [],
        loading: true,
      });
      const eventRecords = [eventRecordFactory()];
      expect(reducers(eventState, actions.fetchSuccess(eventRecords))).toEqual({
        errors: null,
        items: eventRecords,
        loading: false,
        loaded: true,
        saved: false,
        saving: false,
      });
    });

    it("appends new items when reducing fetchSuccess", () => {
      const items = [eventRecordFactory()];
      const eventState = eventStateFactory({
        items,
        loading: true,
      });
      const eventRecords = [eventRecordFactory()];
      expect(reducers(eventState, actions.fetchSuccess(eventRecords))).toEqual({
        errors: null,
        items: items.concat(eventRecords),
        loading: false,
        loaded: true,
        saved: false,
        saving: false,
      });
    });

    it("deduplicates when reducing fetchSuccess", () => {
      const items = [eventRecordFactory(), eventRecordFactory()];
      const eventState = eventStateFactory({
        items,
        loading: true,
      });
      const eventRecords = [items[0], eventRecordFactory()];
      expect(reducers(eventState, actions.fetchSuccess(eventRecords))).toEqual({
        errors: null,
        items: [...items, eventRecords[1]],
        loading: false,
        loaded: true,
        saved: false,
        saving: false,
      });
    });

    it("reduces fetchError", () => {
      const eventState = eventStateFactory();
      expect(
        reducers(eventState, actions.fetchError("Could not fetch events"))
      ).toEqual({
        errors: "Could not fetch events",
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });
  });
});
