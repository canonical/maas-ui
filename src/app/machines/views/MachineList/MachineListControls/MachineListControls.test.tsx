import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineListControls from "./MachineListControls";
import MachinesFilterAccordion from "./MachinesFilterAccordion";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

jest.useFakeTimers("modern");

describe("MachineListControls", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("changes the filter when the filter accordion changes", () => {
    const store = mockStore(initialState);
    const setFilter = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <MachineListControls
            filter=""
            grouping={null}
            hiddenColumns={[]}
            setFilter={setFilter}
            setGrouping={jest.fn()}
            setHiddenColumns={jest.fn()}
            setHiddenGroups={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find(MachinesFilterAccordion).props().setSearchText("status:new");
    });
    expect(setFilter).toHaveBeenCalledWith("status:new");
  });
});
