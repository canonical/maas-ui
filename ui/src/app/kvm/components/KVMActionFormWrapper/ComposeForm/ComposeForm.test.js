import { act } from "react-dom/test-utils";
import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import {
  domainState as domainStateFactory,
  fabricState as fabricStateFactory,
  generalState as generalStateFactory,
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  podStoragePool as podStoragePoolFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  space as spaceFactory,
  spaceState as spaceStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

import ComposeForm, {
  createInterfaceConstraints,
  createStorageConstraints,
  getDefaultPoolLocation,
} from "./ComposeForm";

const mockStore = configureStore();

describe("ComposeForm", () => {
  let initialState = rootStateFactory();

  beforeEach(() => {
    initialState = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      fabric: fabricStateFactory({
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({ loaded: true }),
      }),
      pod: podStateFactory({
        items: [podDetailsFactory({ id: 1 })],
        loaded: true,
        statuses: { 1: podStatusFactory() },
      }),
      resourcepool: resourcePoolStateFactory({
        loaded: true,
      }),
      space: spaceStateFactory({
        loaded: true,
      }),
      subnet: subnetStateFactory({
        loaded: true,
      }),
      vlan: vlanStateFactory({
        loaded: true,
      }),
      zone: zoneStateFactory({
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <ComposeForm />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = [
      "FETCH_DOMAIN",
      "FETCH_FABRIC",
      "FETCH_GENERAL_POWER_TYPES",
      "resourcepool/fetch",
      "space/fetch",
      "subnet/fetch",
      "vlan/fetch",
      "zone/fetch",
      "GET_POD",
    ];
    const actions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(actions.some((action) => action.type === expectedAction));
    });
  });

  it("displays a spinner if data has not loaded", () => {
    const state = { ...initialState };
    state.zone.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <ComposeForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });

  it("composes a machine", () => {
    const pod = podDetailsFactory({
      id: 1,
      storage_pools: [
        podStoragePoolFactory({ name: "pool-1" }),
        podStoragePoolFactory({ name: "pool-2 " }),
      ],
    });
    const space = spaceFactory({ id: 1, name: "outer" });
    const subnet = subnetFactory({ id: 10, cidr: "192.168.1.1/24" });
    const state = { ...initialState };
    state.pod.items = [pod];
    state.space.items = [space];
    state.subnet.items = [subnet];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route exact path="/kvm/:id" component={() => <ComposeForm />} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          architecture: "amd64/generic",
          bootDisk: 2,
          cores: 5,
          disks: [
            {
              id: 1,
              location: "pool-1",
              size: 16,
              tags: ["tag1", "tag2"],
            },
            {
              id: 2,
              location: "pool-2",
              size: 32,
              tags: ["tag3"],
            },
          ],
          domain: "0",
          hostname: "mean-bean-machine",
          id: "1",
          interfaces: [
            {
              id: 1,
              ipAddress: "192.168.1.1",
              name: "eth0",
              space: "1",
              subnet: "10",
            },
          ],
          memory: 4096,
          pool: "2",
          zone: "3",
        })
    );
    expect(
      store.getActions().find((action) => action.type === "pod/compose")
    ).toStrictEqual({
      type: "pod/compose",
      meta: {
        method: "compose",
        model: "pod",
      },
      payload: {
        params: {
          architecture: "amd64/generic",
          cores: 5,
          domain: 0,
          hostname: "mean-bean-machine",
          id: 1,
          interfaces:
            "eth0:ip=192.168.1.1,space=outer,subnet_cidr=192.168.1.1/24",
          memory: 4096,
          pool: 2,
          storage: "2:32(pool-2,tag3),1:16(pool-1,tag1,tag2)",
          zone: 3,
        },
      },
    });
  });

  describe("createInterfacesConstraint", () => {
    it("returns an empty string if no interfaces are given", () => {
      const interfaceFields = [];
      expect(createInterfaceConstraints(interfaceFields, [], [])).toEqual("");
    });

    it("returns an empty string if no constraints are given", () => {
      const interfaceFields = [
        {
          id: 1,
          ipAddress: "",
          name: "eth0",
          space: "",
          subnet: "",
        },
      ];
      expect(createInterfaceConstraints(interfaceFields, [], [])).toEqual("");
    });

    it("can create a single interface constraint", () => {
      const space = spaceFactory();
      const subnet = subnetFactory();
      const interfaceFields = [
        {
          id: 1,
          ipAddress: "192.168.1.1",
          name: "eth0",
          space: `${space.id}`,
          subnet: `${subnet.id}`,
        },
      ];
      expect(
        createInterfaceConstraints(interfaceFields, [space], [subnet])
      ).toEqual(
        `eth0:ip=${interfaceFields[0].ipAddress},space=${space.name},subnet_cidr=${subnet.cidr}`
      );
    });

    it("can create multiple interface constraints", () => {
      const [space1, space2] = [spaceFactory(), spaceFactory()];
      const [subnet1, subnet2] = [subnetFactory(), subnetFactory()];
      const [interface1, interface2] = [
        {
          id: 1,
          ipAddress: "192.168.1.1",
          name: "eth0",
          space: `${space1.id}`,
          subnet: `${subnet1.id}`,
        },
        {
          id: 2,
          ipAddress: "192.168.1.2",
          name: "eth1",
          space: `${space2.id}`,
          subnet: `${subnet2.id}`,
        },
      ];
      expect(
        createInterfaceConstraints(
          [interface1, interface2],
          [space1, space2],
          [subnet1, subnet2]
        )
      ).toEqual(
        `eth0:ip=${interface1.ipAddress},space=${space1.name},subnet_cidr=${subnet1.cidr};` +
          `eth1:ip=${interface2.ipAddress},space=${space2.name},subnet_cidr=${subnet2.cidr}`
      );
    });
  });

  describe("createStorageConstraints", () => {
    it("returns an empty string if no disks are given", () => {
      expect(createStorageConstraints()).toEqual("");
      expect(createStorageConstraints([])).toEqual("");
    });

    it("correctly returns storage constraint for pod compose action", () => {
      const [pool1, pool2] = [
        podStoragePoolFactory({ name: "pool-1" }),
        podStoragePoolFactory({ name: "pool-2" }),
      ];
      const [bootDisk, otherDisk] = [
        { id: 1, location: pool1.name, size: 16, tags: ["tag1", "tag2"] },
        { id: 2, location: pool2.name, size: 32, tags: ["tag3"] },
      ];

      expect(
        createStorageConstraints([otherDisk, bootDisk], bootDisk.id)
      ).toEqual(
        `${bootDisk.id}:${bootDisk.size}(${
          bootDisk.location
        },${bootDisk.tags.join(",")}),${otherDisk.id}:${otherDisk.size}(${
          otherDisk.location
        },${otherDisk.tags.join(",")})`
      );
    });
  });

  describe("getDefaultPoolLocation", () => {
    it("returns 'local' for RSD pods", () => {
      const pod = podDetailsFactory({ type: "rsd" });
      expect(getDefaultPoolLocation(pod)).toBe("local");
    });

    it("correctly returns default pool name for non-RSD pods", () => {
      const [defaultPool, otherPool] = [
        podStoragePoolFactory(),
        podStoragePoolFactory(),
      ];
      const pod = podDetailsFactory({
        default_storage_pool: defaultPool.id,
        storage_pools: [defaultPool, otherPool],
        type: "lxd",
      });
      expect(getDefaultPoolLocation(pod)).toBe(defaultPool.name);
    });
  });
});
