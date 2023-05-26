import NodeName from "./NodeName";
import type { Props as NodeNameProps } from "./NodeName";

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
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

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
    renderWithBrowserRouter(
      <NodeName
        editingName={false}
        node={null}
        onSubmit={jest.fn()}
        setEditingName={jest.fn()}
      />,
      { route: "/machine/abc123", state }
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays just the name when not editable", () => {
    state.machine.items[0].locked = true;
    renderWithBrowserRouter(
      <NodeName
        editingName={false}
        node={machine}
        onSubmit={jest.fn()}
        setEditingName={jest.fn()}
      />,
      { route: "/machine/abc123", state }
    );
    expect(screen.getByText(state.machine.items[0].fqdn)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("displays name in a button", () => {
    renderWithBrowserRouter(
      <NodeName
        editingName={false}
        node={machine}
        onSubmit={jest.fn()}
        setEditingName={jest.fn()}
      />,
      { route: "/machine/abc123", state }
    );

    expect(
      screen.getByRole("button", { name: state.machine.items[0].fqdn })
    ).toBeInTheDocument();
  });

  it("changes the form state when clicking the name", async () => {
    const setEditingName = jest.fn();
    renderWithBrowserRouter(
      <NodeName
        editingName={false}
        node={machine}
        onSubmit={jest.fn()}
        setEditingName={setEditingName}
      />,
      { route: "/machine/abc123", state }
    );

    await userEvent.click(
      screen.getByRole("button", { name: state.machine.items[0].fqdn })
    );
    expect(setEditingName).toHaveBeenCalled();
  });

  it("can display the form", () => {
    renderWithBrowserRouter(
      <NodeName
        editingName={true}
        node={machine}
        onSubmit={jest.fn()}
        setEditingName={jest.fn()}
      />,
      { route: "/machine/abc123", state }
    );
    expect(screen.getByRole("textbox", { name: "Hostname" })).toHaveValue(
      state.machine.items[0].hostname
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("closes the form when it saves", () => {
    state.machine.saving = true;
    const setEditingName = jest.fn();
    const ProxyNodeName = (props: NodeNameProps) => <NodeName {...props} />;
    const { rerender } = renderWithBrowserRouter(
      <ProxyNodeName
        editingName={true}
        node={machine}
        onSubmit={jest.fn()}
        saved={false}
        saving={true}
        setEditingName={setEditingName}
      />,
      { route: "/machine/abc123", state }
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

  it("can display a hostname error", async () => {
    renderWithBrowserRouter(
      <NodeName
        editingName={true}
        node={machine}
        onSubmit={jest.fn()}
        setEditingName={jest.fn()}
      />,
      { route: "/machine/abc123", state }
    );

    await userEvent.clear(screen.getByRole("textbox", { name: "Hostname" }));
    expect(
      screen.getByText("hostname is a required field")
    ).toBeInTheDocument();
  });
});
