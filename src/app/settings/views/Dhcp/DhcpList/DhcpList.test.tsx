import { screen, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DhcpList from "./DhcpList";

import type { RootState } from "app/store/root/types";
import {
  controllerState as controllerStateFactory,
  deviceState as deviceStateFactory,
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

const mockStore = configureStore();

describe("DhcpList", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
      }),
      device: deviceStateFactory({
        loaded: true,
      }),
      dhcpsnippet: dhcpSnippetStateFactory({
        loaded: true,
        items: [
          dhcpSnippetFactory({ id: 1, name: "class", description: "" }),
          dhcpSnippetFactory({
            id: 2,
            name: "lease",
            subnet: 2,
            description: "",
          }),
          dhcpSnippetFactory({
            id: 3,
            name: "boot",
            node: "xyz",
            description: "",
          }),
        ],
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "xyz",
            hostname: "machine1",
            domain: modelRefFactory({ name: "test" }),
          }),
        ],
      }),
      subnet: subnetStateFactory({
        loaded: true,
        items: [
          subnetFactory({ id: 1, name: "10.0.0.99" }),
          subnetFactory({ id: 2, name: "test.maas" }),
        ],
      }),
    });
  });

  it("can show a delete confirmation", async () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <DhcpList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    let row = screen.getAllByTestId("dhcp-row")[0];
    expect(row).not.toHaveClass("is-active");

    // Click on the delete button:
    await userEvent.click(within(row).getByTestId("table-actions-delete"));

    row = screen.getAllByTestId("dhcp-row")[0];
    expect(row).toHaveClass("is-active");
  });

  it("can delete a dhcp snippet", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <CompatRouter>
            <DhcpList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    let row = screen.getAllByTestId("dhcp-row")[1];
    expect(row).not.toHaveClass("is-active");

    // Click on the delete button:
    await userEvent.click(within(row).getByTestId("table-actions-delete"));

    row = screen.getAllByTestId("dhcp-row")[1];
    expect(row).toHaveClass("is-active");

    // Click on the delete confirm button
    await userEvent.click(within(row).getByTestId("action-confirm"));

    expect(
      store.getActions().find((action) => action.type === "dhcpsnippet/delete")
    ).toEqual({
      type: "dhcpsnippet/delete",
      payload: {
        params: {
          id: 2,
        },
      },
      meta: {
        model: "dhcpsnippet",
        method: "delete",
      },
    });
  });

  it("can add a message when a dhcp snippet is deleted", async () => {
    state.dhcpsnippet.saved = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <CompatRouter>
            <DhcpList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    let row = screen.getAllByTestId("dhcp-row")[1];
    expect(row).not.toHaveClass("is-active");

    // Click on the delete button:
    await userEvent.click(within(row).getByTestId("table-actions-delete"));

    row = screen.getAllByTestId("dhcp-row")[1];
    expect(row).toHaveClass("is-active");

    // Click on the delete confirm button
    await userEvent.click(within(row).getByTestId("action-confirm"));

    const actions = store.getActions();
    expect(
      actions.some((action) => action.type === "dhcpsnippet/cleanup")
    ).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("can show snippet details", async () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <DhcpList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    let row = screen.getAllByTestId("dhcp-row")[0];
    expect(row).not.toHaveClass("is-active");

    // Click on the column toggle button:
    await userEvent.click(
      within(row).getByRole("button", { name: "Show/hide details" })
    );

    row = screen.getAllByTestId("dhcp-row")[0];
    expect(row).toHaveClass("is-active");
  });

  it("can filter dhcp snippets", async () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <CompatRouter>
          <DhcpList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    let rows = screen.getAllByTestId("dhcp-row");
    expect(rows.length).toBe(3);

    await userEvent.type(
      screen.getByRole("searchbox", { name: "Search DHCP snippets" }),
      "lease"
    );

    rows = screen.getAllByTestId("dhcp-row");
    expect(rows.length).toBe(1);
  });
});
