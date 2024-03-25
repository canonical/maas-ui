import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import { DhcpAdd } from "./DhcpAdd";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

describe("DhcpAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState();
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
