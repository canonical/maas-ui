import selectors from "./selectors";

import {
  headerForm as headerFormFactory,
  rootState as rootStateFactory,
  uiState as uiStateFactory,
} from "testing/factories";

describe("ui selectors", () => {
  it("can get the header form", () => {
    const headerForm = headerFormFactory();
    const state = rootStateFactory({
      ui: uiStateFactory({
        headerForm,
      }),
    });
    expect(selectors.headerForm(state)).toBe(headerForm);
  });
});
