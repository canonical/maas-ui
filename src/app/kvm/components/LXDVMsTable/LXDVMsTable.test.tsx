import reduxToolkit from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDVMsTable from "./LXDVMsTable";

import { actions as machineActions } from "app/store/machine";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("LXDVMsTable", () => {
  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches machines on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDVMsTable
            getResources={jest.fn()}
            searchFilter=""
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
            vms={[]}
          />
        </MemoryRouter>
      </Provider>
    );

    const expectedAction = machineActions.fetch("mocked-nanoid");
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("clears machine selected state on unmount", async () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDVMsTable
            getResources={jest.fn()}
            searchFilter=""
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
            vms={[]}
          />
        </MemoryRouter>
      </Provider>
    );

    unmount();

    const expectedAction = machineActions.setSelected([]);
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("shows an add VM button if function provided", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDVMsTable
            getResources={jest.fn()}
            onAddVMClick={jest.fn()}
            searchFilter=""
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
            vms={[]}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("button", { name: "Add VM" })).toBeInTheDocument();
  });

  it("does not show an add VM button if no function provided", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDVMsTable
            getResources={jest.fn()}
            searchFilter=""
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
            vms={[]}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByRole("button", { name: "Add VM" })
    ).not.toBeInTheDocument();
  });
});
