import { Formik } from "formik";
import configureStore from "redux-mock-store";

import ComposeForm from "../ComposeForm";

import ComposeFormFields from "./ComposeFormFields";

import { DriverType } from "app/store/general/types";
import { PodType } from "app/store/pod/constants";
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
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import {
  screen,
  renderWithBrowserRouter,
  renderWithMockStore,
  userEvent,
  fireEvent,
} from "testing/utils";

const mockStore = configureStore<RootState>();

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
        items: [podDetailsFactory({ id: 1, type: "lxd" })],
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
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
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
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm/1", store }
    );
    // Allocated = 1 + 2 = 3
    // Total = (1 + 2 + 3) * 3 = 18
    // Available = 18 - 3 = 15

    expect(screen.getByText("15 cores available.")).toHaveClass(
      "p-form-help-text"
    );
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
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm/1", store }
    );
    // Allocated = (1000 + 2000) + (4000 + 5000) = 12000
    // Hugepages do not take overcommit into account, so
    // Total = ((1000 + 2000 + 3000) * 2) + (4000 + 5000 + 6000) = 12000 + 15000 = 27000
    // Available = 27000 - 12000 = 15000

    expect(screen.getByText("15000MiB available.")).toHaveClass(
      "p-form-help-text"
    );
  });

  it("shows warnings if available cores/memory is less than the default", () => {
    const state = { ...initialState };
    const powerType = powerTypeFactory({
      defaults: { cores: 2, memory: 2, storage: 2 },
      driver_type: DriverType.POD,
      name: PodType.VIRSH,
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
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm/1", store }
    );
    expect(
      screen.getByText(
        /The available cores \(1\) is less than the recommended default \(2\)/i
      )
    ).toHaveClass("p-form-validation__message");
    expect(
      screen.getByText(
        /The available memory \(0MiB\) is less than the recommended default \(2MiB\)/i
      )
    ).toHaveClass("p-form-validation__message");
  });

  it("does not allow hugepage backing non-LXD pods", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithMockStore(
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
      </Formik>,
      { store }
    );

    expect(screen.getByLabelText("Enable hugepages")).toBeDisabled();

    expect(
      screen.getByRole("tooltip", {
        name: "Hugepages are only supported on LXD KVMs.",
      })
    ).toBeInTheDocument();
  });

  it("disables hugepage backing checkbox if no hugepages are free", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithMockStore(
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
      </Formik>,
      { store }
    );

    expect(screen.getByLabelText("Enable hugepages")).toBeDisabled();

    expect(
      screen.getByRole("tooltip", {
        name: "There are no free hugepages on this system.",
      })
    ).toBeInTheDocument();
  });

  it("shows the input for any available cores by default", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithMockStore(
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
      </Formik>,
      { store }
    );

    expect(
      screen.getByRole("spinbutton", { name: "Cores" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("textbox", { name: "Pinned cores" })
    ).not.toBeInTheDocument();
  });

  it("can switch to pinning specific cores to the VM if using a LXD KVM", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithMockStore(
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
      </Formik>,
      { store }
    );

    await userEvent.click(
      screen.getByRole("radio", { name: "Pin VM to specific core(s)" })
    );

    expect(
      screen.queryByRole("spinbutton", { name: "Cores" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Pinned cores" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("2 cores available (unpinned indices: 0-1)")
    ).toHaveClass("p-form-help-text");
  });

  it("does not allow pinning cores for non-LXD pods", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithMockStore(
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
      </Formik>,
      { store }
    );

    expect(
      screen.getByRole("radio", { name: "Pin VM to specific core(s)" })
    ).toBeDisabled();
    expect(
      screen.getByRole("tooltip", {
        name: "Core pinning is only supported on LXD KVMs",
      })
    ).toBeInTheDocument();
  });

  it("can detect duplicate core indices", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm/1", store }
    );

    // Switch to pinning cores
    await userEvent.click(
      screen.getByRole("radio", { name: "Pin VM to specific core(s)" })
    );

    // Enter duplicate core indices
    await userEvent.type(
      screen.getByRole("textbox", { name: "Pinned cores" }),
      "0, 0"
    );

    fireEvent.blur(screen.getByRole("textbox", { name: "Pinned cores" }));

    expect(screen.getByText("Duplicate core indices detected.")).toHaveClass(
      "p-form-validation__message"
    );
  });

  it("shows an error if there are no cores available to pin", async () => {
    const state = { ...initialState };
    state.pod.items[0].resources = podResourcesFactory({
      cores: podResourceFactory({ free: 0 }),
    });
    state.pod.items[0].cpu_over_commit_ratio = 1;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm/1", store }
    );

    // Switch to pinning cores
    await userEvent.click(
      screen.getByRole("radio", { name: "Pin VM to specific core(s)" })
    );

    expect(
      screen.getByText("There are no cores available to pin.")
    ).toHaveClass("p-form-validation__message");
  });

  it("shows an error if trying to pin more cores than are available", async () => {
    const state = { ...initialState };
    state.pod.items[0].resources = podResourcesFactory({
      cores: podResourceFactory({ free: 1 }),
    });
    state.pod.items[0].cpu_over_commit_ratio = 1;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm/1", store }
    );

    // Switch to pinning cores
    await userEvent.click(
      screen.getByRole("radio", { name: "Pin VM to specific core(s)" })
    );
    // Enter more than the available number of cores
    await userEvent.type(
      screen.getByRole("textbox", { name: "Pinned cores" }),
      "0, 1"
    );
    fireEvent.blur(screen.getByRole("textbox", { name: "Pinned cores" }));

    expect(
      screen.getByText(
        "Number of cores requested (2) is more than available (1)."
      )
    ).toHaveClass("p-form-validation__message");
  });

  it("shows a warning if some of the selected pinned cores are already pinned", async () => {
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
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={jest.fn()} hostId={1} />,
      { route: "/kvm/1", store }
    );

    // Switch to pinning cores
    await userEvent.click(
      screen.getByRole("radio", { name: "Pin VM to specific core(s)" })
    );
    // Enter a core index that is not available
    await userEvent.type(
      screen.getByRole("textbox", { name: "Pinned cores" }),
      "1-3"
    );
    fireEvent.blur(screen.getByRole("textbox", { name: "Pinned cores" }));

    expect(
      screen.getByText("The following cores have already been pinned: 1,3")
    ).toHaveClass("p-form-validation__message");

    // Enter a core index that is available
    await userEvent.clear(
      screen.getByRole("textbox", { name: "Pinned cores" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Pinned cores" }),
      "2"
    );

    expect(
      screen.queryByText("The following cores have already been pinned: 1,3")
    ).not.toBeInTheDocument();
  });
});
