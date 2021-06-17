import reducers, { actions } from "./slice";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
} from "testing/factories";

describe("domain reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      active: null,
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces fetch", () => {
    expect(reducers(undefined, actions.fetch())).toEqual(domainStateFactory());
  });

  it("reduces fetchStart", () => {
    expect(reducers(undefined, actions.fetchStart())).toEqual(
      domainStateFactory({
        loading: true,
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const domains = [domainFactory()];
    const domainState = domainStateFactory({
      items: [],
      loading: true,
    });
    expect(reducers(domainState, actions.fetchSuccess(domains))).toEqual(
      domainStateFactory({
        loading: false,
        loaded: true,
        items: domains,
      })
    );
  });

  it("reduces fetchError", () => {
    const domainState = domainStateFactory();

    expect(
      reducers(domainState, actions.fetchError("Could not fetch domains"))
    ).toEqual(
      domainStateFactory({
        errors: "Could not fetch domains",
      })
    );
  });

  it("reduces createStart", () => {
    const domainState = domainStateFactory({ saved: true });

    expect(reducers(domainState, actions.createStart())).toEqual(
      domainStateFactory({
        saving: true,
      })
    );
  });

  it("reduces createError", () => {
    const domainState = domainStateFactory();

    expect(
      reducers(
        domainState,
        actions.createError({ name: "Domain name already exists" })
      )
    ).toEqual(
      domainStateFactory({
        errors: { name: "Domain name already exists" },
      })
    );
  });

  it("updates domains on createNotify", () => {
    const domains = [domainFactory({ id: 1 })];
    const newDomain = domainFactory({ id: 2 });
    const domainState = domainStateFactory({
      items: domains,
    });

    expect(reducers(domainState, actions.createNotify(newDomain))).toEqual(
      domainStateFactory({
        items: [...domains, newDomain],
      })
    );
  });

  it("reduces deleteStart", () => {
    const domains = [domainFactory({ id: 1 })];
    const domainState = domainStateFactory({
      items: domains,
    });

    expect(reducers(domainState, actions.deleteStart())).toEqual(
      domainStateFactory({
        items: domains,
        saving: true,
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const domains = [domainFactory({ id: 1 })];
    const domainState = domainStateFactory({
      items: domains,
      saving: true,
    });
    expect(reducers(domainState, actions.deleteSuccess())).toEqual(
      domainStateFactory({
        items: domains,
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces deleteError", () => {
    const domains = [domainFactory({ id: 1 })];
    const domainState = domainStateFactory({
      items: domains,
    });
    expect(
      reducers(domainState, actions.deleteError("Domain cannot be deleted"))
    ).toEqual(
      domainStateFactory({
        errors: "Domain cannot be deleted",
        items: domains,
      })
    );
  });

  it("reduces deleteNotify", () => {
    const domains = [domainFactory({ id: 1 }), domainFactory({ id: 2 })];
    const domainState = domainStateFactory({
      items: domains,
    });

    expect(reducers(domainState, actions.deleteNotify(1))).toEqual(
      domainStateFactory({
        items: [domains[1]],
      })
    );
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

  it("reduces getStart", () => {
    const domainState = domainStateFactory({ items: [], loading: false });

    expect(reducers(domainState, actions.getStart())).toEqual(
      domainStateFactory({ loading: true })
    );
  });

  it("reduces getSuccess", () => {
    const newDomain = domainFactory();
    const domainState = domainStateFactory({
      items: [],
      loading: true,
    });

    expect(reducers(domainState, actions.getSuccess(newDomain))).toEqual(
      domainStateFactory({
        items: [newDomain],
        loading: false,
      })
    );
  });

  it("reduces getError", () => {
    const domainState = domainStateFactory({ loading: true });

    expect(
      reducers(domainState, actions.getError("Could not get domain"))
    ).toEqual(
      domainStateFactory({
        errors: "Could not get domain",
        loading: false,
      })
    );
  });

  // Related to: https://bugs.launchpad.net/maas/+bug/1931654.
  it("reduces getError when the error when a domain can't be found", () => {
    const domainState = domainStateFactory({
      errors: null,
      saving: true,
    });

    expect(reducers(domainState, actions.getError("9"))).toEqual(
      domainStateFactory({
        errors: "There was an error getting the domain.",
        saving: false,
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

  // Related to: https://bugs.launchpad.net/maas/+bug/1931654.
  it("reduces setDefaultError when the error when a domain can't be found", () => {
    const domainState = domainStateFactory({
      errors: null,
      saving: true,
    });

    expect(reducers(domainState, actions.setDefaultError("9"))).toEqual(
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

  it("reduces setActiveError", () => {
    const podState = domainStateFactory({
      active: 1,
      errors: null,
    });

    expect(
      reducers(
        podState,
        actions.setActiveError("Domain with this id does not exist")
      )
    ).toEqual(
      domainStateFactory({
        active: null,
        errors: "Domain with this id does not exist",
      })
    );
  });

  // Related to: https://bugs.launchpad.net/maas/+bug/1931654.
  it("reduces setActiveError when the error when a domain can't be found", () => {
    const domainState = domainStateFactory({
      errors: null,
    });

    expect(reducers(domainState, actions.setActiveError("9"))).toEqual(
      domainStateFactory({
        errors: "There was an error when setting active domain.",
        saving: false,
      })
    );
  });

  it("reduces setActiveSuccess", () => {
    const podState = domainStateFactory({
      active: null,
    });

    expect(
      reducers(podState, actions.setActiveSuccess(domainFactory({ id: 101 })))
    ).toEqual(
      domainStateFactory({
        active: 101,
      })
    );
  });
});
