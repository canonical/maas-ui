import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";

import { DhcpEdit } from "./DhcpEdit";

import { Labels as DhcpFormFieldsLabels } from "app/base/components/DhcpFormFields/DhcpFormFields";
import type { RootState } from "app/store/root/types";
import {
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("DhcpEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        items: [
          dhcpSnippetFactory({
            id: 1,
          }),
          dhcpSnippetFactory({
            id: 2,
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("displays a loading component if loading", () => {
    state.dhcpsnippet.loading = true;
    state.dhcpsnippet.loaded = false;
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/dhcp/1/edit", key: "testKey" }]}
      >
        <CompatRouter>
          <DhcpEdit />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles dhcp snippet not found", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/settings/dhcp/99999/edit", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <DhcpEdit />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("DHCP snippet not found")).toBeInTheDocument();
  });

  it("can display a dhcp snippet edit form", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings/dhcp/1/edit", key: "testKey" }]}
      >
        <CompatRouter>
          <Routes>
            <Route element={<DhcpEdit />} path="/settings/dhcp/:id/edit" />
          </Routes>
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.getByRole("form", { name: "Editing `test snippet`" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: DhcpFormFieldsLabels.Name })
    ).toHaveValue("test snippet");

    expect(
      screen.getByRole("textbox", { name: DhcpFormFieldsLabels.Description })
    ).toHaveValue("test description");

    expect(
      screen.getByRole("checkbox", { name: DhcpFormFieldsLabels.Enabled })
    ).not.toBeChecked();

    expect(
      screen.getByRole("textbox", { name: DhcpFormFieldsLabels.Value })
    ).toHaveValue("test value");
  });
});
