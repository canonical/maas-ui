import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import KVMListHeader from "./KVMListHeader";

import urls from "@/app/base/urls";
import AddLxd from "@/app/kvm/components/KVMForms/AddLxd";
import AddVirsh from "@/app/kvm/components/KVMForms/AddVirsh";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { mockSidePanel } from "@/testing/utils";

const { mockOpen } = await mockSidePanel();
const mockStore = configureStore();

describe("KVMListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      pod: factory.podState({
        loaded: true,
        items: [factory.pod({ id: 1 }), factory.pod({ id: 2 })],
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("displays a loader if pods have not loaded", () => {
    state.pod.loaded = false;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListHeader title="some text" />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays a pod count if pods have loaded", () => {
    state.pod.loaded = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMListHeader title="some text" />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("2 KVM hosts available")).toBeInTheDocument();
  });

  it("can open the add LXD form at the LXD URL", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.kvm.lxd.index, key: "testKey" }]}
        >
          <KVMListHeader title="LXD" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("button", { name: "Add LXD host" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add Virsh host" })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Add LXD host" }));
    expect(mockOpen).toHaveBeenCalledWith({
      component: AddLxd,
      title: "Add LXD host",
    });
  });

  it("can open the add Virsh form at the Virsh URL", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.kvm.virsh.index, key: "testKey" }]}
        >
          <KVMListHeader title="Virsh" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("button", { name: "Add Virsh host" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add LXD host" })
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Add Virsh host" })
    );
    expect(mockOpen).toHaveBeenCalledWith({
      component: AddVirsh,
      title: "Add Virsh host",
    });
  });
});
