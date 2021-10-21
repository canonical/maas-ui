import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LXDVMsTable from "./LXDVMsTable";

import { rootState as rootStateFactory } from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("LXDVMsTable", () => {
  it("fetches machines on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDVMsTable
            getResources={jest.fn()}
            onRefreshClick={jest.fn()}
            searchFilter=""
            setSearchFilter={jest.fn()}
            setHeaderContent={jest.fn()}
            vms={[]}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "machine/fetch")
    );
  });

  it("clears machine selected state on unmount", async () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <LXDVMsTable
            getResources={jest.fn()}
            onRefreshClick={jest.fn()}
            searchFilter=""
            setSearchFilter={jest.fn()}
            setHeaderContent={jest.fn()}
            vms={[]}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    await waitForComponentToPaint(wrapper);

    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual({ type: "machine/setSelected", payload: [] });
  });
});
