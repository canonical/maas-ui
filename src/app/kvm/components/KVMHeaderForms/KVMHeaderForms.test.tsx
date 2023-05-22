import configureStore from "redux-mock-store";

import KVMHeaderForms from "./KVMHeaderForms";

import { KVMHeaderViews } from "app/kvm/constants";
import { MachineHeaderViews } from "app/machines/constants";
import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("KVMHeaderForms", () => {
  let state = rootStateFactory();

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({ id: 1, name: "pod-1", type: PodType.LXD }),
          podFactory({ id: 2, name: "pod-2", type: PodType.VIRSH }),
        ],
        statuses: {
          1: podStatusFactory(),
          2: podStatusFactory(),
        },
      }),
    });
  });

  it("does not render if sidePanelContent is not defined", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <KVMHeaderForms
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
      />,
      { store }
    );
    expect(
      screen.queryByTestId("kvm-action-form-wrapper")
    ).not.toBeInTheDocument();
  });

  it("renders AddLxd if Add LXD host header content provided", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <KVMHeaderForms
        setSidePanelContent={jest.fn()}
        sidePanelContent={{ view: KVMHeaderViews.ADD_LXD_HOST }}
      />,
      { store }
    );
    expect(
      screen.getByRole("heading", { name: /Add LXD Host/i })
    ).toBeInTheDocument();
  });

  it("renders AddVirsh if Add Virsh host header content provided", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <KVMHeaderForms
        setSidePanelContent={jest.fn()}
        sidePanelContent={{ view: KVMHeaderViews.ADD_VIRSH_HOST }}
      />,
      { store }
    );
    expect(
      screen.getByRole("heading", { name: /Add Virsh Host/i })
    ).toBeInTheDocument();
  });

  it("renders ComposeForm if Compose header content and host id provided", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <KVMHeaderForms
        setSidePanelContent={jest.fn()}
        sidePanelContent={{
          view: KVMHeaderViews.COMPOSE_VM,
          extras: { hostId: 1 },
        }}
      />,
      { store }
    );
    expect(
      screen.getByRole("heading", { name: /Compose/i })
    ).toBeInTheDocument();
  });

  it("renders DeleteForm if delete header content and host id provided", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <KVMHeaderForms
        setSidePanelContent={jest.fn()}
        sidePanelContent={{
          view: KVMHeaderViews.DELETE_KVM,
          extras: { hostId: 1 },
        }}
      />,
      { store }
    );
    expect(
      screen.getByRole("heading", { name: /Delete/i })
    ).toBeInTheDocument();
  });

  it("renders DeleteForm if delete header content and cluster id provided", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <KVMHeaderForms
        setSidePanelContent={jest.fn()}
        sidePanelContent={{
          view: KVMHeaderViews.DELETE_KVM,
          extras: { clusterId: 1 },
        }}
      />,
      { store }
    );
    expect(
      screen.getByRole("heading", { name: /Delete/i })
    ).toBeInTheDocument();
  });

  it("renders RefreshForm if refresh header content and host ids provided", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <KVMHeaderForms
        setSidePanelContent={jest.fn()}
        sidePanelContent={{
          view: KVMHeaderViews.REFRESH_KVM,
          extras: { hostIds: [1] },
        }}
      />,
      { store }
    );
    expect(
      screen.getByRole("heading", { name: /Refresh/i })
    ).toBeInTheDocument();
  });

  it("renders machine action forms if a machine action is selected", () => {
    state.machine.selectedMachines = { items: ["abc123"] };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <KVMHeaderForms
        setSidePanelContent={jest.fn()}
        sidePanelContent={{ view: MachineHeaderViews.COMMISSION_MACHINE }}
      />,
      { store }
    );
    expect(
      screen.getByRole("heading", { name: /Commission a Machine/i })
    ).toBeInTheDocument();
  });

  it("renders machine action forms with selected machine count", () => {
    state.machine.selectedMachines = { items: ["abc123", "def456"] };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <KVMHeaderForms
        setSidePanelContent={jest.fn()}
        sidePanelContent={{ view: MachineHeaderViews.DELETE_MACHINE }}
      />,
      { store, route: "/kvm" }
    );

    expect(
      screen.getByRole("button", { name: /Delete 2 machines/i })
    ).toBeInTheDocument();
  });
});
