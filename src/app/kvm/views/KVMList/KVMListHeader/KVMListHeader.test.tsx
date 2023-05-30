import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import KVMListHeader from "./KVMListHeader";

import urls from "app/base/urls";
import { KVMHeaderViews } from "app/kvm/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMListHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
        items: [podFactory({ id: 1 }), podFactory({ id: 2 })],
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loader if pods have not loaded", () => {
    state.pod.loaded = false;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
              title="some text"
            />
          </CompatRouter>
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
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={jest.fn()}
              sidePanelContent={null}
              title="some text"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("section-header-subtitle")).toHaveTextContent(
      "2 KVM hosts available"
    );
  });

  it("can open the add LXD form at the LXD URL", async () => {
    const setSidePanelContent = jest.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.kvm.lxd.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={setSidePanelContent}
              sidePanelContent={null}
              title="LXD"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("add-kvm")).toHaveTextContent("Add LXD host");
    await userEvent.click(screen.getByTestId("add-kvm"));
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.ADD_LXD_HOST,
    });
  });

  it("can open the add Virsh form at the Virsh URL", async () => {
    const setSidePanelContent = jest.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: urls.kvm.virsh.index, key: "testKey" }]}
        >
          <CompatRouter>
            <KVMListHeader
              setSidePanelContent={setSidePanelContent}
              sidePanelContent={null}
              title="Virsh"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("add-kvm")).toHaveTextContent("Add Virsh host");
    await userEvent.click(screen.getByTestId("add-kvm"));
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.ADD_VIRSH_HOST,
    });
  });
});
