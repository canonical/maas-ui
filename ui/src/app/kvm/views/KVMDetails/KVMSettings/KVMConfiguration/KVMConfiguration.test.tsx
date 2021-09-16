import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMConfiguration from "./KVMConfiguration";

import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("KVMConfiguration", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, name: "pod1" })],
        loaded: true,
      }),
    });
  });

  it("can handle updating a lxd KVM", () => {
    const pod = podFactory({ id: 1, type: PodType.LXD });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <KVMConfiguration pod={pod} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        cpu_over_commit_ratio: 2,
        memory_over_commit_ratio: 2,
        pool: "1",
        power_address: "192.168.1.1",
        tags: ["tag1", "tag2"],
        type: "lxd",
        zone: "2",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "pod/update")
    ).toStrictEqual({
      type: "pod/update",
      meta: {
        method: "update",
        model: "pod",
      },
      payload: {
        params: {
          cpu_over_commit_ratio: 2,
          id: 1,
          memory_over_commit_ratio: 2,
          pool: 1,
          power_address: "192.168.1.1",
          power_pass: undefined,
          tags: "tag1,tag2",
          zone: 2,
        },
      },
    });
  });

  it("can handle updating a virsh KVM", () => {
    const pod = podFactory({ id: 1, type: PodType.VIRSH });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <KVMConfiguration pod={pod} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        cpu_over_commit_ratio: 2,
        memory_over_commit_ratio: 2,
        pool: "1",
        power_address: "192.168.1.1",
        power_pass: "password",
        tags: ["tag1", "tag2"],
        type: "virsh",
        zone: "2",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "pod/update")
    ).toStrictEqual({
      type: "pod/update",
      meta: {
        method: "update",
        model: "pod",
      },
      payload: {
        params: {
          cpu_over_commit_ratio: 2,
          id: 1,
          memory_over_commit_ratio: 2,
          pool: 1,
          power_address: "192.168.1.1",
          power_pass: "password", // virsh uses power_pass key
          tags: "tag1,tag2",
          zone: 2,
        },
      },
    });
  });
});
