import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMDetailsHeader from "./KVMDetailsHeader";

import { KVMHeaderViews } from "app/kvm/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStatuses as podStatusesFactory,
  podVmCount as podVmCountFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMDetailsHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          podFactory({
            id: 1,
            name: "pod-1",
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 10 }),
            }),
          }),
        ],
        statuses: podStatusesFactory({
          1: podStatusFactory(),
        }),
      }),
    });
  });

  it("renders header forms and no extra title blocks if header content has been selected", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMDetailsHeader
            headerContent={{ view: KVMHeaderViews.COMPOSE_VM }}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
            tabLinks={[]}
            title="Title"
            titleBlocks={[{ title: "Title", subtitle: "Subtitle" }]}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("KVMHeaderForms").exists()).toBe(true);
    expect(wrapper.find("[data-test='extra-title-block']").exists()).toBe(
      false
    );
  });

  it("renders extra title blocks if no header content has been selected", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <KVMDetailsHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            setSearchFilter={jest.fn()}
            tabLinks={[]}
            title="Title"
            titleBlocks={[{ title: "Title", subtitle: "Subtitle" }]}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='extra-title-block']").exists()).toBe(true);
    expect(wrapper.find("KVMHeaderForms").exists()).toBe(false);
  });
});
