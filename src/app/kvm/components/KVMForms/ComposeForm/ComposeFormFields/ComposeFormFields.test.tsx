import { Formik } from "formik";
import configureStore from "redux-mock-store";

import ComposeForm from "../ComposeForm";

import ComposeFormFields from "./ComposeFormFields";

import { DriverType } from "@/app/store/general/types";
import { PodType } from "@/app/store/pod/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  screen,
  renderWithBrowserRouter,
  renderWithMockStore,
  userEvent,
  fireEvent,
  expectTooltipOnHover,
  waitFor,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ComposeFormFields", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = factory.rootState({
      domain: factory.domainState({
        loaded: true,
      }),
      fabric: factory.fabricState({
        loaded: true,
      }),
      general: factory.generalState({
        powerTypes: factory.powerTypesState({
          data: [factory.powerType()],
          loaded: true,
        }),
      }),
      pod: factory.podState({
        items: [factory.podDetails({ id: 1, type: "lxd" })],
        loaded: true,
        statuses: { 1: factory.podStatus() },
      }),
      resourcepool: factory.resourcePoolState({
        loaded: true,
      }),
      space: factory.spaceState({
        loaded: true,
      }),
      subnet: factory.subnetState({
        loaded: true,
      }),
      vlan: factory.vlanState({
        loaded: true,
      }),
      zone: factory.zoneState({
        genericActions: factory.zoneGenericActions({ fetch: "success" }),
      }),
    });
  });

  it("correctly displays the available cores", () => {
    const state = { ...initialState };
    const pod = state.pod.items[0];
    pod.resources = factory.podResources({
      cores: factory.podResource({
        allocated_other: 1,
        allocated_tracked: 2,
        free: 3,
      }),
    });
    pod.cpu_over_commit_ratio = 3;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={vi.fn()} hostId={1} />,
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
    pod.resources = factory.podResources({
      memory: factory.podMemoryResource({
        general: factory.podResource({
          allocated_other: toMiB(1000),
          allocated_tracked: toMiB(2000),
          free: toMiB(3000),
        }),
        hugepages: factory.podResource({
          allocated_other: toMiB(4000),
          allocated_tracked: toMiB(5000),
          free: toMiB(6000),
        }),
      }),
    });
    pod.memory_over_commit_ratio = 2;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={vi.fn()} hostId={1} />,
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
    const powerType = factory.powerType({
      defaults: { cores: 2, memory: 2, storage: 2 },
      driver_type: DriverType.POD,
      name: PodType.VIRSH,
    });
    state.general.powerTypes.data = [powerType];
    state.pod.items = [
      factory.podDetails({
        cpu_over_commit_ratio: 1,
        id: 1,
        memory_over_commit_ratio: 1,
        type: PodType.VIRSH,
        resources: factory.podResources({
          cores: factory.podResource({
            allocated_other: 0,
            allocated_tracked: 0,
            free: 1,
          }),
          memory: factory.podMemoryResource({
            general: factory.podResource({
              allocated_other: 0,
              allocated_tracked: 0,
              free: 1,
            }),
            hugepages: factory.podResource({
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
      <ComposeForm clearSidePanelContent={vi.fn()} hostId={1} />,
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
      <Formik initialValues={{}} onSubmit={vi.fn()}>
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

    const enableHugepages = screen.getByLabelText("Enable hugepages");
    expect(enableHugepages).toBeDisabled();
    await userEvent.hover(enableHugepages);
    await waitFor(() => {
      expect(
        screen.getByRole("tooltip", {
          name: "Hugepages are only supported on LXD KVMs.",
        })
      ).toBeInTheDocument();
    });
  });

  it("disables hugepage backing checkbox if no hugepages are free", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={vi.fn()}>
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

    await expectTooltipOnHover(
      screen.getByLabelText("Enable hugepages"),
      "There are no free hugepages on this system."
    );
  });

  it("shows the input for any available cores by default", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={vi.fn()}>
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
      <Formik initialValues={{}} onSubmit={vi.fn()}>
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
      <Formik initialValues={{}} onSubmit={vi.fn()}>
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

    await expectTooltipOnHover(
      screen.getByRole("radio", { name: "Pin VM to specific core(s)" }),
      "Core pinning is only supported on LXD KVMs"
    );
  });

  it("can detect duplicate core indices", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={vi.fn()} hostId={1} />,
      { route: "/kvm/1", store }
    );

    // Switch to pinning cores
    await userEvent.click(
      screen.getByRole("radio", { name: "Pin VM to specific core(s)" })
    );

    // Enter duplicate core indices
    await userEvent.type(
      screen.getByRole("textbox", { name: "Pinned cores" }),
      "0, 0{tab}"
    );

    expect(screen.getByText("Duplicate core indices detected.")).toHaveClass(
      "p-form-validation__message"
    );
  });

  it("shows an error if there are no cores available to pin", async () => {
    const state = { ...initialState };
    state.pod.items[0].resources = factory.podResources({
      cores: factory.podResource({ free: 0 }),
    });
    state.pod.items[0].cpu_over_commit_ratio = 1;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={vi.fn()} hostId={1} />,
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
    state.pod.items[0].resources = factory.podResources({
      cores: factory.podResource({ free: 1 }),
    });
    state.pod.items[0].cpu_over_commit_ratio = 1;
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={vi.fn()} hostId={1} />,
      { route: "/kvm/1", state }
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
    state.pod.items[0].resources = factory.podResources({
      numa: [
        factory.podNuma({
          cores: factory.podNumaCores({
            allocated: [0],
            free: [2], // Only core index available
          }),
        }),
        factory.podNuma({
          cores: factory.podNumaCores({
            allocated: [1, 3],
            free: [],
          }),
        }),
      ],
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ComposeForm clearSidePanelContent={vi.fn()} hostId={1} />,
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
