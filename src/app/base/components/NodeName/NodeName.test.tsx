import { act } from "react-dom/test-utils";
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
import { render, screen } from "testing/utils";

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
    const { getByText } = render(
      <NodeName
        editingName={false}
        node={null}
        onSubmit={jest.fn()}
        setEditingName={jest.fn()}
      />,
      { store, route: "/machine/abc123" }
    );
    expect(getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays just the name when not editable", () => {
    state.machine.items[0].locked = true;
    const store = mockStore(state);
    const { getByTestId } = render(
      <NodeName
        editingName={false}
        node={machine}
        onSubmit={jest.fn()}
        setEditingName={jest.fn()}
      />,
      { store, route: "/machine/abc123" }
    );
    expect(getByTestId("node-name")).toBeInTheDocument();
  });

  it("displays name in a button", () => {
    const store = mockStore(state);
    const { getByTestId } = render(
      <NodeName
        editingName={false}
        node={machine}
        onSubmit={jest.fn()}
        setEditingName={jest.fn()}
      />,
      { store, route: "/machine/abc123" }
    );
    expect(getByTestId("node-name-button")).toBeInTheDocument();
  });

  it("changes the form state when clicking the name", () => {
    const setEditingName = jest.fn();
    const store = mockStore(state);
    const { getByTestId } = render(
      <NodeName
        editingName={false}
        node={machine}
        onSubmit={jest.fn()}
        setEditingName={setEditingName}
      />,
      { store, route: "/machine/abc123" }
    );
    act(() => {
      getByTestId("node-name-button").click();
    });
    expect(setEditingName).toHaveBeenCalled();
  });

  it("can display the form", () => {
    const store = mockStore(state);
    const { getByTestId } = render(
      <NodeName
        editingName={true}
        node={machine}
        onSubmit={jest.fn()}
        setEditingName={jest.fn()}
      />,
      { store, route: "/machine/abc123" }
    );
    expect(getByTestId("node-name-form")).toMatchSnapshot();
  });

  it("closes the form when it saves", () => {
    state.machine.saving = true;
    const setEditingName = jest.fn();
    const store = mockStore(state);
    const ProxyNodeName = (props: NodeNameProps) => (
      (<NodeName {...props} />), { store, route: "/machine/abc123" }
    );
    const { rerender } = render(
      <ProxyNodeName
        editingName={true}
        node={machine}
        onSubmit={jest.fn()}
        saved={false}
        saving={true}
        setEditingName={setEditingName}
      />
    );
    rerender(
      <ProxyNodeName
        editingName={true}
        node={machine}
        onSubmit={jest.fn()}
        saved={true}
        saving={false}
        setEditingName={setEditingName}
      />
    );
    expect(setEditingName).toHaveBeenCalledWith(false);
  });

  it("can display a hostname error", () => {
    const store = mockStore(state);
    const { getByTestId } = render(
      <NodeName
        editingName={true}
        node={machine}
        onSubmit={jest.fn()}
        setEditingName={jest.fn()}
      />,
      { store, route: "/machine/abc123" }
    );
    act(() => {
      getByTestId("node-name-fields").props.setHostnameError("Uh oh!");
    });
    expect(screen.getByText(/Error: Uh oh!/i)).toBeInTheDocument();
  });
});
