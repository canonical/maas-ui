import reducers, { actions } from "./slice";

import {
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
} from "testing/factories";

describe("dhcpSnippet reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(
      dhcpSnippetStateFactory()
    );
  });

  describe("fetch", () => {
    it("reduces fetchStart", () => {
      const initialState = dhcpSnippetStateFactory({ loading: false });

      expect(reducers(initialState, actions.fetchStart())).toEqual(
        dhcpSnippetStateFactory({ loading: true })
      );
    });

    it("reduces fetchSuccess", () => {
      const initialState = dhcpSnippetStateFactory({
        items: [],
        loaded: false,
        loading: true,
      });
      const dhcpSnippets = [dhcpSnippetFactory(), dhcpSnippetFactory()];

      expect(
        reducers(initialState, actions.fetchSuccess(dhcpSnippets))
      ).toEqual(
        dhcpSnippetStateFactory({
          items: dhcpSnippets,
          loaded: true,
          loading: false,
        })
      );
    });

    it("reduces fetchError", () => {
      const initialState = dhcpSnippetStateFactory({
        errors: "",
        loading: true,
      });

      expect(
        reducers(
          initialState,
          actions.fetchError("Could not fetch dhcpSnippets")
        )
      ).toEqual(
        dhcpSnippetStateFactory({
          errors: "Could not fetch dhcpSnippets",
          loading: false,
        })
      );
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const initialState = dhcpSnippetStateFactory({ saving: false });

      expect(reducers(initialState, actions.createStart())).toEqual(
        dhcpSnippetStateFactory({ saving: true })
      );
    });

    it("reduces createSuccess", () => {
      const initialState = dhcpSnippetStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.createSuccess())).toEqual(
        dhcpSnippetStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces createNotify", () => {
      const initialState = dhcpSnippetStateFactory({
        items: [dhcpSnippetFactory()],
      });
      const newDHCPSnippet = dhcpSnippetFactory();

      expect(
        reducers(initialState, actions.createNotify(newDHCPSnippet))
      ).toEqual(
        dhcpSnippetStateFactory({
          items: [...initialState.items, newDHCPSnippet],
        })
      );
    });

    it("reduces createError", () => {
      const initialState = dhcpSnippetStateFactory({
        errors: "",
        saving: true,
      });

      expect(
        reducers(
          initialState,
          actions.createError("Could not create dhcpSnippet")
        )
      ).toEqual(
        dhcpSnippetStateFactory({
          errors: "Could not create dhcpSnippet",
          saving: false,
        })
      );
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const initialState = dhcpSnippetStateFactory({ saving: false });

      expect(reducers(initialState, actions.updateStart())).toEqual(
        dhcpSnippetStateFactory({ saving: true })
      );
    });

    it("reduces updateSuccess", () => {
      const initialState = dhcpSnippetStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.updateSuccess())).toEqual(
        dhcpSnippetStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces updateNotify", () => {
      const initialState = dhcpSnippetStateFactory({
        items: [dhcpSnippetFactory()],
      });
      const updatedDHCPSnippet = dhcpSnippetFactory({
        id: initialState.items[0].id,
        name: "updated-reducers",
      });

      expect(
        reducers(initialState, actions.updateNotify(updatedDHCPSnippet))
      ).toEqual(dhcpSnippetStateFactory({ items: [updatedDHCPSnippet] }));
    });

    it("reduces updateError", () => {
      const initialState = dhcpSnippetStateFactory({
        errors: "",
        saving: true,
      });

      expect(
        reducers(
          initialState,
          actions.updateError("Could not update dhcpSnippet")
        )
      ).toEqual(
        dhcpSnippetStateFactory({
          errors: "Could not update dhcpSnippet",
          saving: false,
        })
      );
    });
  });

  describe("delete", () => {
    it("reduces deleteStart", () => {
      const initialState = dhcpSnippetStateFactory({ saving: false });

      expect(reducers(initialState, actions.deleteStart())).toEqual(
        dhcpSnippetStateFactory({ saving: true })
      );
    });

    it("reduces deleteSuccess", () => {
      const initialState = dhcpSnippetStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.deleteSuccess())).toEqual(
        dhcpSnippetStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces deleteNotify", () => {
      const [deleteDHCPSnippet, keepDHCPSnippet] = [
        dhcpSnippetFactory(),
        dhcpSnippetFactory(),
      ];
      const initialState = dhcpSnippetStateFactory({
        items: [deleteDHCPSnippet, keepDHCPSnippet],
      });

      expect(
        reducers(initialState, actions.deleteNotify(deleteDHCPSnippet.id))
      ).toEqual(dhcpSnippetStateFactory({ items: [keepDHCPSnippet] }));
    });

    it("reduces deleteError", () => {
      const initialState = dhcpSnippetStateFactory({
        errors: "",
        saving: true,
      });

      expect(
        reducers(
          initialState,
          actions.deleteError("Could not delete dhcpSnippet")
        )
      ).toEqual(
        dhcpSnippetStateFactory({
          errors: "Could not delete dhcpSnippet",
          saving: false,
        })
      );
    });
  });
});
