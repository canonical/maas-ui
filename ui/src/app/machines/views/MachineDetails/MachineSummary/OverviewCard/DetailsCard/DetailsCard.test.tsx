import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DetailsCard from "./DetailsCard";

import kvmURLs from "app/kvm/urls";
import { PowerTypeNames } from "app/store/general/constants";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  pod as podFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DetailsCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [],
          loaded: true,
        }),
      }),
    });
  });

  it("renders the owner", () => {
    const machine = machineDetailsFactory({ owner: "admin" });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='owner']").text()).toEqual("admin");
  });

  it("renders the domain", () => {
    const machine = machineDetailsFactory({ domain: { id: 1, name: "maas" } });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='domain']").text()).toEqual("maas");
  });

  it("renders host details for LXD machines", () => {
    const machine = machineDetailsFactory({
      pod: { id: 1, name: "lxd-pod" },
      power_type: PowerTypeNames.LXD,
    });
    const pod = podFactory({
      id: 1,
      name: "lxd-pod",
      type: PodType.LXD,
    });

    state.machine.items = [machine];
    state.pod.items = [pod];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='host']").text()).toEqual("lxd-pod ›");
    expect(wrapper.find("[data-testid='host'] Link").prop("to")).toBe(
      kvmURLs.lxd.single.index({ id: pod.id })
    );
  });

  it("renders host details for virsh machines", () => {
    const machine = machineDetailsFactory({
      pod: { id: 1, name: "virsh-pod" },
      power_type: PowerTypeNames.VIRSH,
    });
    const pod = podFactory({
      id: 1,
      name: "virsh-pod",
      type: PodType.VIRSH,
    });

    state.machine.items = [machine];
    state.pod.items = [pod];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='host']").text()).toEqual("virsh-pod ›");
    expect(wrapper.find("[data-testid='host'] Link").prop("to")).toBe(
      kvmURLs.virsh.details.index({ id: pod.id })
    );
  });

  it("renders a link to zone configuration with edit permissions", () => {
    const machine = machineDetailsFactory({
      permissions: ["edit"],
      zone: { id: 1, name: "danger" },
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='zone'] Link").text()).toEqual("Zone ›");
    expect(wrapper.find("[data-testid='zone'] span").text()).toEqual("danger");
  });

  it("renders a zone label without edit permissions", () => {
    const machine = machineDetailsFactory({
      permissions: [],
      zone: { id: 1, name: "danger" },
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='zone'] Link").exists()).toBe(false);
    expect(
      wrapper.find("[data-testid='zone']").childAt(1).find("span").text()
    ).toEqual("danger");
  });

  it("renders a link to resource pool configuration with edit permissions", () => {
    const machine = machineDetailsFactory({
      permissions: ["edit"],
      pool: { id: 1, name: "swimming" },
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='resource-pool'] Link").text()).toEqual(
      "Resource pool ›"
    );
    expect(wrapper.find("[data-testid='resource-pool'] span").text()).toEqual(
      "swimming"
    );
  });

  it("renders a resource pool label without edit permissions", () => {
    const machine = machineDetailsFactory({
      permissions: [],
      pool: { id: 1, name: "swimming" },
    });
    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='resource-pool'] Link").exists()).toBe(
      false
    );
    expect(
      wrapper
        .find("[data-testid='resource-pool']")
        .childAt(1)
        .find("span")
        .text()
    ).toEqual("swimming");
  });

  it("renders a formatted power type", () => {
    const machine = machineDetailsFactory({
      power_type: PowerTypeNames.LXD,
    });
    const powerType = powerTypeFactory({
      name: PowerTypeNames.LXD,
      description: "LXD (virtual systems)",
    });
    state.machine.items = [machine];
    state.general.powerTypes.data = [powerType];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='power-type']").text()).toEqual("LXD");
  });

  it("shows a spinner if tags are not loaded", () => {
    const machine = machineDetailsFactory({ tags: [1] });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
      }),
      tag: tagStateFactory({
        items: [],
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='loading-tags']").exists()).toBe(true);
  });

  it("renders a list of tags once loaded", () => {
    const machine = machineDetailsFactory({ tags: [1, 2, 3] });
    const tags = [
      tagFactory({ id: 1, name: "virtual" }),
      tagFactory({ id: 2, name: "test" }),
      tagFactory({ id: 3, name: "lxd" }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
      }),
      tag: tagStateFactory({
        items: tags,
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <DetailsCard machine={machine} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='machine-tags']").text()).toEqual(
      "lxd, test, virtual"
    );
  });
});
