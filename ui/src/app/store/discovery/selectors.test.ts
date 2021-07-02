import selectors from "./selectors";

import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("discovery selectors", () => {
  it("can get all items", () => {
    const items = [discoveryFactory()];
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        items,
      }),
    });
    expect(selectors.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        loading: true,
      }),
    });
    expect(selectors.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
      }),
    });
    expect(selectors.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const errors = "Nothing to discover";
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        errors,
      }),
    });
    expect(selectors.errors(state)).toEqual(errors);
  });

  it("can get a discovery by id", () => {
    const discovery = discoveryFactory({ discovery_id: "123" });
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        items: [discovery],
      }),
    });
    expect(selectors.getById(state, "123")).toEqual(discovery);
    expect(selectors.getById(state, "456")).toEqual(null);
  });

  it("can search items", () => {
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        items: [
          discoveryFactory({
            hostname: "foo",
            mac_address: "00:16:3e:9c:bf:e9",
            mac_organization: "Acme Inc.",
            ip: "0.0.0.0",
            observer_hostname: "alpha",
            last_seen: "Mon, 19 Oct. 2020 01:15:57",
          }),
          discoveryFactory({
            hostname: "bar",
            mac_address: "00:16:4a:9c:bf:e9",
            mac_organization: "Foodies Inc.",
            ip: "1.1.1.1",
            observer_hostname: "bravo",
            last_seen: "Sat, 17 Oct. 2020 01:15:57",
          }),
          discoveryFactory({
            hostname: "foobar",
            mac_address: "00:16:5b:9c:bf:e9",
            mac_organization: "Roxxon",
            ip: "2.2.2.2",
            observer_hostname: "foot",
            last_seen: "Mon, 19 Oct. 2020 01:15:57",
          }),
          discoveryFactory({
            hostname: "fizz",
            mac_address: "00:17:3e:9c:bf:e9",
            mac_organization: "Pacific Couriers",
            ip: "3.3.3.3",
            observer_hostname: "alpha",
            last_seen: "Mon, 19 Oct. 2020 01:15:57",
          }),
        ],
      }),
    });

    let results = selectors.search(state, "foo");
    expect(results.length).toEqual(3);

    expect(results[0].hostname).toEqual("foo");
    expect(results[1].mac_organization).toEqual("Foodies Inc.");
    expect(results[2].observer_hostname).toEqual("foot");

    results = selectors.search(state, "hostname:bar");
    expect(results.length).toEqual(2);

    expect(results[0].hostname).toEqual("bar");
    expect(results[1].hostname).toEqual("foobar");
  });
});
