import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import NodeName from "./NodeName";
import type { Props as NodeNameProps } from "./NodeName";
import NodeNameFields from "./NodeNameFields";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NodeName", () => {
  let state: RootState;
  let machine: Machine;

  beforeEach(() => {
    const domain = domainFactory({ id: 99 });
    machine = machineDetailsFactory({
      domain,
      locked: false,
      permissions: ["edit"],
      system_id: "abc123",
    });
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [domain],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [machine],
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <NodeName
              editingName={false}
              node={null}
              onSubmit={jest.fn()}
              setEditingName={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays just the name when not editable", () => {
    state.machine.items[0].locked = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <NodeName
              editingName={false}
              node={machine}
              onSubmit={jest.fn()}
              setEditingName={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".node-name").exists()).toBe(true);
  });

  it("displays name in a button", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <NodeName
              editingName={false}
              node={machine}
              onSubmit={jest.fn()}
              setEditingName={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Button.node-name--editable").exists()).toBe(true);
  });

  it("changes the form state when clicking the name", () => {
    const setEditingName = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <NodeName
              editingName={false}
              node={machine}
              onSubmit={jest.fn()}
              setEditingName={setEditingName}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Button.node-name--editable").simulate("click");
    expect(setEditingName).toHaveBeenCalled();
  });

  it("can display the form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <NodeName
              editingName={true}
              node={machine}
              onSubmit={jest.fn()}
              setEditingName={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikForm")).toMatchSnapshot();
  });

  it("closes the form when it saves", () => {
    state.machine.saving = true;
    const setEditingName = jest.fn();
    const store = mockStore(state);
    const ProxyNodeName = (props: NodeNameProps) => (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <NodeName {...props} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(
      <ProxyNodeName
        editingName={true}
        node={machine}
        onSubmit={jest.fn()}
        saved={false}
        saving={true}
        setEditingName={setEditingName}
      />
    );
    wrapper.setProps({
      saved: true,
      saving: false,
    });
    expect(setEditingName).toHaveBeenCalledWith(false);
  });

  it("can display a hostname error", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <NodeName
              editingName={true}
              node={machine}
              onSubmit={jest.fn()}
              setEditingName={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find(NodeNameFields).props().setHostnameError("Uh oh!");
    });
    wrapper.update();
    const error = wrapper.find(".node-name__error");
    expect(error.exists()).toBe(true);
    expect(error.text()).toBe("Error: Uh oh!");
  });
});
