import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DhcpList from "./DhcpList";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  within,
  renderWithMockStore,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("DhcpList", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      controller: factory.controllerState({
        loaded: true,
      }),
      device: factory.deviceState({
        loaded: true,
      }),
      dhcpsnippet: factory.dhcpSnippetState({
        loaded: true,
        items: [
          factory.dhcpSnippet({ id: 1, name: "class", description: "" }),
          factory.dhcpSnippet({
            id: 2,
            name: "lease",
            subnet: 2,
            description: "",
          }),
          factory.dhcpSnippet({
            id: 3,
            name: "boot",
            node: "xyz",
            description: "",
          }),
        ],
      }),
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machine({
            system_id: "xyz",
            hostname: "machine1",
            domain: factory.modelRef({ name: "test" }),
          }),
        ],
      }),
      subnet: factory.subnetState({
        loaded: true,
        items: [
          factory.subnet({ id: 1, name: "10.0.0.99" }),
          factory.subnet({ id: 2, name: "test.maas" }),
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
      screen.getAllByPlaceholderText("Search DHCP snippets")[0],
      "lease"
    );

    rows = screen.getAllByTestId("dhcp-row");
    expect(rows.length).toBe(1);
  });

  it("displays a message when DHCP list is empty", () => {
    state.dhcpsnippet.items = [];
    renderWithBrowserRouter(<DhcpList />, { state, route: "/" });

    expect(screen.getByText("No DHCP snippets available.")).toBeInTheDocument();
  });
});
