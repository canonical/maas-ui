import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { ExpandedState } from "../NetworkTable/types";

import NetworkActions from "./NetworkActions";

import type { RootState } from "app/store/root/types";
import { NodeActions, NodeStatus } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NetworkActions", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkActions
            expanded={null}
            setExpanded={jest.fn()}
            setSelectedAction={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NetworkActions")).toMatchSnapshot();
  });

  it("disables the validate network button when networking is disabled", () => {
    state.machine.items[0].status = NodeStatus.DEPLOYED;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkActions
            expanded={null}
            setExpanded={jest.fn()}
            setSelectedAction={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Button").last().prop("disabled")).toBe(true);
  });

  it("shows the test form when clicking the validate network button", () => {
    const store = mockStore(state);
    const setSelectedAction = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkActions
            expanded={null}
            setExpanded={jest.fn()}
            setSelectedAction={setSelectedAction}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Button").last().simulate("click");
    expect(setSelectedAction).toHaveBeenCalledWith({
      name: NodeActions.TEST,
      formProps: { applyConfiguredNetworking: true },
    });
  });

  it("sets the state to show the add interface form when clicking the button", () => {
    const store = mockStore(state);
    const setExpanded = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkActions
            expanded={null}
            setExpanded={setExpanded}
            setSelectedAction={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Button[children='Add interface']").simulate("click");
    expect(setExpanded).toHaveBeenCalledWith({
      content: ExpandedState.ADD_PHYSICAL,
    });
  });

  it("disables the add interface button when networking is disabled", () => {
    state.machine.items[0].status = NodeStatus.DEPLOYED;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkActions
            expanded={null}
            setExpanded={jest.fn()}
            setSelectedAction={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("Button[children='Add interface']").prop("disabled")
    ).toBe(true);
  });

  it("disables the add interface button when the form is expanded", () => {
    state.machine.items[0].status = NodeStatus.DEPLOYED;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkActions
            expanded={{ content: ExpandedState.ADD_PHYSICAL }}
            setExpanded={jest.fn()}
            setSelectedAction={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find("Button[children='Add interface']").prop("disabled")
    ).toBe(true);
  });
});
