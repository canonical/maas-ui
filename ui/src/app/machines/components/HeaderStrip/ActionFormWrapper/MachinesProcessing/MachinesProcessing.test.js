import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import MachinesProcessing from "./MachinesProcessing";

const mockStore = configureStore();

describe("MachinesProcessing", () => {
  let state;
  beforeEach(() => {
    state = {
      general: {
        machineActions: {
          data: [{ name: "set-pool", sentence: "change those pools" }],
        },
      },
      machine: {
        items: [],
        selected: [1, 2],
      },
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachinesProcessing
            action="set-pool"
            machinesProcessing={[{ id: 1 }, { id: 2 }]}
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MachinesProcessing")).toMatchSnapshot();
  });

  it("can set the processed count before it has started", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachinesProcessing
            action="set-pool"
            machinesProcessing={[{ id: 1 }, { id: 2 }]}
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("p").text()).toEqual(
      "0 of 2 nodes are transitioning to change those pools."
    );
  });

  it("can show the processed count", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachinesProcessing
            action="set-pool"
            machinesProcessing={[{ id: 2 }]}
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("p").text()).toEqual(
      "1 of 2 nodes are transitioning to change those pools."
    );
  });

  it("calls functions when processing is complete", () => {
    const setProcessing = jest.fn();
    const setSelectedAction = jest.fn();
    const store = mockStore(state);
    const Proxy = ({ machinesProcessing }) => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MachinesProcessing
            action="set-pool"
            machinesProcessing={machinesProcessing}
            setProcessing={setProcessing}
            setSelectedAction={setSelectedAction}
          />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy machinesProcessing={[{ id: 2 }]} />);
    expect(setProcessing).not.toHaveBeenCalled();
    expect(setSelectedAction).not.toHaveBeenCalled();
    wrapper.setProps({ machinesProcessing: [] });
    expect(setProcessing).toHaveBeenCalled();
    expect(setSelectedAction).toHaveBeenCalled();
  });
});
