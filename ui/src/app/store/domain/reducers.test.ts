import reducers, { actions } from "./slice";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
} from "testing/factories";

describe("domain reducer", () => {
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

  it("reduces fetch", () => {
    expect(reducers(undefined, actions.fetch())).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces fetchStart", () => {
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
    const domains = [domainFactory()];
    const domainState = domainStateFactory({
      items: [],
      loading: true,
    });
    expect(reducers(domainState, actions.fetchSuccess(domains))).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
      items: domains,
    });
  });

  it("reduces fetchError", () => {
    const domainState = domainStateFactory();

    expect(
      reducers(domainState, actions.fetchError("Could not fetch domains"))
    ).toEqual({
      errors: "Could not fetch domains",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces createStart", () => {
    const domainState = domainStateFactory({ saved: true });

    expect(reducers(domainState, actions.createStart())).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("reduces createError", () => {
    const domainState = domainStateFactory();

    expect(
      reducers(
        domainState,
        actions.createError({ name: "Domain name already exists" })
      )
    ).toEqual({
      errors: { name: "Domain name already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("updates domains on createNotify", () => {
    const domains = [domainFactory({ id: 1 })];
    const newDomain = domainFactory({ id: 2 });
    const domainState = domainStateFactory({
      items: domains,
    });

    expect(reducers(domainState, actions.createNotify(newDomain))).toEqual({
      errors: {},
      items: [...domains, newDomain],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces deleteStart", () => {
    const domains = [domainFactory({ id: 1 })];
    const domainState = domainStateFactory({
      items: domains,
    });

    expect(reducers(domainState, actions.deleteStart())).toEqual({
      errors: {},
      items: domains,
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("reduces deleteSuccess", () => {
    const domains = [domainFactory({ id: 1 })];
    const domainState = domainStateFactory({
      items: domains,
    });
    expect(reducers(domainState, actions.deleteSuccess())).toEqual({
      errors: null,
      items: domains,
      loaded: false,
      loading: false,
      saved: true,
      saving: false,
    });
  });

  it("reduces deleteError", () => {
    const domains = [domainFactory({ id: 1 })];
    const domainState = domainStateFactory({
      items: domains,
    });
    expect(
      reducers(domainState, actions.deleteError("Domain cannot be deleted"))
    ).toEqual({
      errors: "Domain cannot be deleted",
      items: domains,
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces deleteNotify", () => {
    const domains = [domainFactory({ id: 1 }), domainFactory({ id: 2 })];
    const domainState = domainStateFactory({
      items: domains,
    });

    expect(reducers(domainState, actions.deleteNotify(1))).toEqual({
      errors: {},
      items: [domains[1]],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });
});
