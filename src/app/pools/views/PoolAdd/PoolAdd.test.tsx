import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { PoolAdd, Label as PoolAddLabel } from "./PoolAdd";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { screen, renderWithMockStore } from "testing/utils";

describe("PoolAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/pool/add", key: "testKey" }]}
      >
        <CompatRouter>
          <PoolAdd />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByRole("form", { name: PoolAddLabel.Title }));
  });
});
