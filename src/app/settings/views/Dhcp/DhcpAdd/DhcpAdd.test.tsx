import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { DhcpAdd } from "./DhcpAdd";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { screen, renderWithMockStore } from "testing/utils";

describe("DhcpAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/dhcp/add", key: "testKey" }]}
      >
        <CompatRouter>
          <DhcpAdd />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getByRole("form", { name: "Add DHCP snippet" })
    ).toBeInTheDocument();
  });
});
