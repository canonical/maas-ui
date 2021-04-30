import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import ComposeForm from "../ComposeForm";

import ComposeFormFields from "./ComposeFormFields";

import { DriverType } from "app/store/general/types";
import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  domainState as domainStateFactory,
  fabricState as fabricStateFactory,
  generalState as generalStateFactory,
  podDetails as podDetailsFactory,
  podMemoryResource as podMemoryResourceFactory,
  podNuma as podNumaFactory,
  podNumaCores as podNumaCoresFactory,
  podResource as podResourceFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  spaceState as spaceStateFactory,
  subnetState as subnetStateFactory,
  vlanState as vlanStateFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("ComposeFormFields", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      fabric: fabricStateFactory({
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
          loaded: true,
        }),
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

  it("correctly displays the available cores", () => {
    const state = { ...initialState };
    const pod = state.pod.items[0];
    pod.resources = podResourcesFactory({
      cores: podResourceFactory({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 3,
      }),
    });
    pod.cpu_over_commit_ratio = 3;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <ComposeForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );
    // Allocated = 1 + 2 = 3
    // Total = (1 + 2 + 3) * 3 = 18
    // Available = 18 - 3 = 15
    expect(
      wrapper.find("FormikField[name='cores'] .p-form-help-text").text()
    ).toEqual("15 cores available.");
  });

  it("correctly displays the available memory", () => {
    const state = { ...initialState };
    const pod = state.pod.items[0];
    const toMiB = (num: number) => num * 1024 ** 2;
    pod.resources = podResourcesFactory({
      memory: podMemoryResourceFactory({
        general: podResourceFactory({
          allocated_other: toMiB(1000),
          allocated_tracked: toMiB(2000),
          free: toMiB(3000),
        }),
        hugepages: podResourceFactory({
          allocated_other: toMiB(4000),
          allocated_tracked: toMiB(5000),
          free: toMiB(6000),
        }),
      }),
    });
    pod.memory_over_commit_ratio = 2;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <ComposeForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );
    // Allocated = (1000 + 2000) + (4000 + 5000) = 12000
    // Hugepages do not take overcommit into account, so
    // Total = ((1000 + 2000 + 3000) * 2) + (4000 + 5000 + 6000) = 12000 + 15000 = 27000
    // Available = 27000 - 12000 = 15000
    expect(
      wrapper.find("FormikField[name='memory'] .p-form-help-text").text()
    ).toEqual("15000MiB available.");
  });

  it("shows warnings if available cores/memory is less than the default", () => {
    const state = { ...initialState };
    const powerType = powerTypeFactory({
      defaults: { cores: 2, memory: 2, storage: 2 },
      driver_type: DriverType.POD,
      name: "virsh",
    });
    state.general.powerTypes.data = [powerType];
    state.pod.items = [
      podDetailsFactory({
        cpu_over_commit_ratio: 1,
        id: 1,
        memory_over_commit_ratio: 1,
        type: PodType.VIRSH,
        resources: podResourcesFactory({
          cores: podResourceFactory({
            allocated_other: 0,
            allocated_tracked: 0,
            free: 1,
          }),
          memory: podMemoryResourceFactory({
            general: podResourceFactory({
              allocated_other: 0,
              allocated_tracked: 0,
              free: 1,
            }),
            hugepages: podResourceFactory({
              allocated_other: 0,
              allocated_tracked: 0,
              free: 0,
            }),
          }),
        }),
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <ComposeForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("FormikField[name='cores'] .p-form-validation__message")
        .exists()
    ).toBe(true);
    expect(
      wrapper
        .find("FormikField[name='memory'] .p-form-validation__message")
        .exists()
    ).toBe(true);
  });

  it("does not allow hugepage backing non-LXD pods", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <ComposeFormFields
            architectures={[]}
            available={{
              cores: 2,
              hugepages: 0,
              memory: 1024,
              pinnedCores: [0, 1],
            }}
            defaults={{
              cores: 2,
              disk: {
                location: "storage-pool",
                size: 8,
                tags: [],
              },
              memory: 1024,
            }}
            podType={PodType.VIRSH}
          />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("input[name='hugepagesBacked']").prop("disabled")).toBe(
      true
    );
    expect(
      wrapper.find("Tooltip[data-test='hugepages-tooltip']").prop("message")
    ).toBe("Hugepages are only supported on LXD KVMs.");
  });

  it("disables hugepage backing checkbox if no hugepages are free", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <ComposeFormFields
            architectures={[]}
            available={{
              cores: 2,
              hugepages: 0,
              memory: 1024,
              pinnedCores: [0, 1],
            }}
            defaults={{
              cores: 2,
              disk: {
                location: "storage-pool",
                size: 8,
                tags: [],
              },
              memory: 1024,
            }}
            podType={PodType.LXD}
          />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("input[name='hugepagesBacked']").prop("disabled")).toBe(
      true
    );
    expect(
      wrapper.find("Tooltip[data-test='hugepages-tooltip']").prop("message")
    ).toBe("There are no free hugepages on this system.");
  });

  it("shows the input for any available cores by default", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <ComposeFormFields
            architectures={[]}
            available={{
              cores: 1,
              hugepages: 0,
              memory: 1024,
              pinnedCores: [0],
            }}
            defaults={{
              cores: 1,
              disk: {
                location: "storage-pool",
                size: 8,
                tags: [],
              },
              memory: 1024,
            }}
            podType={PodType.LXD}
          />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField[name='cores']").exists()).toBe(true);
    expect(wrapper.find("FormikField[name='pinnedCores']").exists()).toBe(
      false
    );
  });

  it("can switch to pinning specific cores to the VM if using a LXD KVM", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <ComposeFormFields
            architectures={[]}
            available={{
              cores: 2,
              hugepages: 0,
              memory: 1024,
              pinnedCores: [0, 1],
            }}
            defaults={{
              cores: 2,
              disk: {
                location: "storage-pool",
                size: 8,
                tags: [],
              },
              memory: 1024,
            }}
            podType={PodType.LXD}
          />
        </Formik>
      </Provider>
    );

    wrapper.find("input[id='pinning-cores']").simulate("change", {
      target: {
        name: "pinning-cores",
        checked: true,
      },
    });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("FormikField[name='cores']").exists()).toBe(false);
    expect(wrapper.find("FormikField[name='pinnedCores']").exists()).toBe(true);
    expect(wrapper.find("FormikField[name='pinnedCores']").prop("help")).toBe(
      "2 cores available (free indices: 0-1)"
    );
  });

  it("does not allow pinning cores for non-LXD pods", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <ComposeFormFields
            architectures={[]}
            available={{
              cores: 2,
              hugepages: 0,
              memory: 1024,
              pinnedCores: [0, 1],
            }}
            defaults={{
              cores: 2,
              disk: {
                location: "storage-pool",
                size: 8,
                tags: [],
              },
              memory: 1024,
            }}
            podType={PodType.VIRSH}
          />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("input[id='pinning-cores']").prop("disabled")).toBe(
      true
    );
    expect(
      wrapper.find("Tooltip[data-test='core-pin-tooltip']").prop("message")
    ).toBe("Core pinning is only supported on LXD KVMs");
  });

  it("can detect duplicate core indices", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <ComposeForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );

    // Switch to pinning cores
    wrapper.find("input[id='pinning-cores']").simulate("change", {
      target: {
        name: "pinning-cores",
        checked: true,
      },
    });
    // Enter duplicate core indices
    wrapper.find("input[name='pinnedCores']").simulate("change", {
      target: {
        name: "pinnedCores",
        value: "0, 0",
      },
    });
    wrapper.find("input[name='pinnedCores']").simulate("blur");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("Input[name='pinnedCores']").prop("error")).toBe(
      "Duplicate core indices detected."
    );
  });

  it("shows an error if there are no cores available to pin", async () => {
    const state = { ...initialState };
    state.pod.items[0].resources = podResourcesFactory({
      cores: podResourceFactory({ free: 0 }),
    });
    state.pod.items[0].cpu_over_commit_ratio = 1;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <ComposeForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );

    // Switch to pinning cores
    wrapper.find("input[id='pinning-cores']").simulate("change", {
      target: {
        name: "pinning-cores",
        checked: true,
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("Input[name='pinnedCores']").prop("error")).toBe(
      "There are no cores available to pin."
    );
  });

  it("shows an error if trying to pin more cores than are available", async () => {
    const state = { ...initialState };
    state.pod.items[0].resources = podResourcesFactory({
      cores: podResourceFactory({ free: 1 }),
    });
    state.pod.items[0].cpu_over_commit_ratio = 1;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <ComposeForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );

    // Switch to pinning cores
    wrapper.find("input[id='pinning-cores']").simulate("change", {
      target: {
        name: "pinning-cores",
        checked: true,
      },
    });
    // Enter more than the available number of cores
    wrapper.find("input[name='pinnedCores']").simulate("change", {
      target: {
        name: "pinnedCores",
        value: "0, 1",
      },
    });
    wrapper.find("input[name='pinnedCores']").simulate("blur");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("Input[name='pinnedCores']").prop("error")).toBe(
      "Number of cores requested (2) is more than available (1)."
    );
  });

  it("can validate if the pinned cores are available", async () => {
    const state = { ...initialState };
    state.pod.items[0].resources = podResourcesFactory({
      numa: [
        podNumaFactory({
          cores: podNumaCoresFactory({
            allocated: [0],
            free: [2], // Only core index available
          }),
        }),
        podNumaFactory({
          cores: podNumaCoresFactory({
            allocated: [1, 3],
            free: [],
          }),
        }),
      ],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <ComposeForm setSelectedAction={jest.fn()} />}
          />
        </MemoryRouter>
      </Provider>
    );

    // Switch to pinning cores
    wrapper.find("input[id='pinning-cores']").simulate("change", {
      target: {
        name: "pinning-cores",
        checked: true,
      },
    });
    // Enter a core index that is not available
    wrapper.find("input[name='pinnedCores']").simulate("change", {
      target: {
        name: "pinnedCores",
        value: "1",
      },
    });
    wrapper.find("input[name='pinnedCores']").simulate("blur");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("Input[name='pinnedCores']").prop("error")).toBe(
      "Some or all of the selected cores are unavailable."
    );

    // Enter a core index that is available
    wrapper.find("input[name='pinnedCores']").simulate("change", {
      target: {
        name: "pinnedCores",
        value: "2",
      },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("Input[name='pinnedCores']").prop("error")).toBe(
      undefined
    );
  });
});
