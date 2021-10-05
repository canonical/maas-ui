import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
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
          <DetailsCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='owner']").text()).toEqual("admin");
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
          <DetailsCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='domain']").text()).toEqual("maas");
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
          <DetailsCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='host']").text()).toEqual("lxd-pod ›");
    expect(wrapper.find("[data-test='host'] Link").prop("to")).toBe(
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
          <DetailsCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='host']").text()).toEqual("virsh-pod ›");
    expect(wrapper.find("[data-test='host'] Link").prop("to")).toBe(
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
          <DetailsCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='zone'] Link").text()).toEqual("Zone ›");
    expect(wrapper.find("[data-test='zone'] span").text()).toEqual("danger");
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
          <DetailsCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='zone'] Link").exists()).toBe(false);
    expect(
      wrapper.find("[data-test='zone']").childAt(1).find("span").text()
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
          <DetailsCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='resource-pool'] Link").text()).toEqual(
      "Resource pool ›"
    );
    expect(wrapper.find("[data-test='resource-pool'] span").text()).toEqual(
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
          <DetailsCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='resource-pool'] Link").exists()).toBe(
      false
    );
    expect(
      wrapper.find("[data-test='resource-pool']").childAt(1).find("span").text()
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
          <DetailsCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='power-type']").text()).toEqual("LXD");
  });

  it("renders a list of tags", () => {
    const tags = ["virtual", "test", "lxd"];
    const machine = machineDetailsFactory({ tags });

    state.machine.items = [machine];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <DetailsCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='tags'] span").text()).toEqual(
      tags.join(", ")
    );
  });
});
