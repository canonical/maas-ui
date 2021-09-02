import reducers, { actions } from "./slice";

import {
  headerForm as headerFormFactory,
  uiState as uiStateFactory,
} from "testing/factories";

describe("reducers", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toStrictEqual({
      headerForm: null,
    });
  });

  it("should correctly reduce ui/openHeaderForm", () => {
    const initialState = uiStateFactory({ headerForm: null });
    const headerForm = headerFormFactory();
    expect(
      reducers(initialState, actions.openHeaderForm(headerForm))
    ).toStrictEqual(
      uiStateFactory({
        headerForm,
      })
    );
  });

  it("should correctly reduce ui/clearHeaderForm", () => {
    const initialState = uiStateFactory({
      headerForm: headerFormFactory(),
    });
    expect(reducers(initialState, actions.clearHeaderForm())).toStrictEqual(
      uiStateFactory({ headerForm: null })
    );
  });
});
