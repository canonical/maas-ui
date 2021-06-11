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
      errors: null,
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
      errors: null,
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
      errors: null,
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
      errors: null,
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
      errors: null,
      items: [domains[1]],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces setDefaultStart", () => {
    const domainState = domainStateFactory({
      saving: false,
    });

    expect(reducers(domainState, actions.setDefaultStart())).toEqual(
      domainStateFactory({
        saving: true,
        saved: false,
      })
    );
  });

  it("reduces setDefaultError", () => {
    const domainState = domainStateFactory({
      errors: null,
      saving: true,
    });

    expect(
      reducers(domainState, actions.setDefaultError("It didn't work"))
    ).toEqual(
      domainStateFactory({
        errors: "It didn't work",
        saving: false,
      })
    );
  });

  it("reduces setDefaultError when the error when a domain can't be found", () => {
    const domainState = domainStateFactory({
      errors: null,
      saving: true,
    });

    expect(reducers(domainState, actions.setDefaultError(9))).toEqual(
      domainStateFactory({
        errors: "There was an error when setting default domain.",
        saving: false,
      })
    );
  });

  it("reduces setDefaultSuccess", () => {
    const domain1 = domainFactory({ id: 1, is_default: true });
    const domain2 = domainFactory({ id: 2, is_default: false });
    const domainState = domainStateFactory({
      items: [domain1, domain2],
      saving: true,
      saved: false,
    });

    expect(
      reducers(domainState, actions.setDefaultSuccess(domainFactory({ id: 2 })))
    ).toEqual(
      domainStateFactory({
        items: [
          { ...domain1, is_default: false },
          { ...domain2, is_default: true },
        ],
        saving: false,
        saved: true,
        errors: null,
      })
    );
  });
});
