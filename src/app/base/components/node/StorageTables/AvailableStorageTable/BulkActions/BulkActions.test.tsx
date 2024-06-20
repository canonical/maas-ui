import { vi } from "vitest";

import BulkActions from "./BulkActions";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { MachineSidePanelViews } from "@/app/machines/constants";
import { DiskTypes, StorageLayout } from "@/app/store/types/enum";
import * as factory from "@/testing/factories";
import {
  expectTooltipOnHover,
  renderWithBrowserRouter,
  screen,
  userEvent,
} from "@/testing/utils";

describe("BulkActions", () => {
  const setSidePanelContent = vi.fn();
  beforeAll(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
  });
  it("disables create volume group button with tooltip if selected devices are not eligible", async () => {
    const selected = [
      factory.nodeDisk({
        partitions: [factory.nodePartition()],
        type: DiskTypes.PHYSICAL,
      }),
    ];
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            disks: selected,
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions selected={selected} systemId="abc123" />,
      { state }
    );
    const createVolumeGroupButton = screen.getByRole("button", {
      name: "Create volume group",
    });
    expect(createVolumeGroupButton).toHaveAttribute("aria-disabled", "true");
    await expectTooltipOnHover(
      createVolumeGroupButton,
      "Select one or more unpartitioned and unformatted storage devices to create a volume group."
    );
  });

  it("enables create volume group button if selected devices are eligible", () => {
    const selected = [
      factory.nodeDisk({ partitions: null, type: DiskTypes.PHYSICAL }),
      factory.nodePartition({ filesystem: null }),
    ];
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions selected={selected} systemId="abc123" />,
      { state }
    );

    expect(
      screen.getByRole("button", { name: "Create volume group" })
    ).not.toHaveAttribute("aria-disabled", "true");
  });

  it("renders datastore bulk actions if the detected layout is a VMWare layout", () => {
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            detected_storage_layout: StorageLayout.VMFS7,
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(<BulkActions selected={[]} systemId="abc123" />, {
      state,
    });

    expect(screen.getByTestId("vmware-bulk-actions")).toBeInTheDocument();
  });

  it(`enables the create datastore button if at least one unpartitioned and
    unformatted device is selected`, () => {
    const selected = [factory.nodeDisk({ filesystem: null, partitions: null })];
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            detected_storage_layout: StorageLayout.VMFS6,
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions selected={selected} systemId="abc123" />,
      { state }
    );

    expect(
      screen.getByRole("button", { name: "Create datastore" })
    ).not.toHaveAttribute("aria-disabled", "true");
  });

  it(`enables the add to existing datastore button if at least one unpartitioned
    and unformatted device is selected and at least one datastore exists`, () => {
    const datastore = factory.nodeDisk({
      filesystem: factory.nodeFilesystem({ fstype: "vmfs6" }),
    });
    const selected = factory.nodeDisk({ filesystem: null, partitions: null });
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            detected_storage_layout: StorageLayout.VMFS6,
            disks: [datastore, selected],
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions selected={[selected]} systemId="abc123" />,
      { state }
    );

    expect(
      screen.getByRole("button", { name: "Add to existing datastore" })
    ).not.toHaveAttribute("aria-disabled", "true");
  });

  it("can trigger the create datastore sidepanel", async () => {
    const datastore = factory.nodeDisk({
      filesystem: factory.nodeFilesystem({ fstype: "vmfs6" }),
    });
    const selected = factory.nodeDisk({ filesystem: null, partitions: null });
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            detected_storage_layout: StorageLayout.VMFS6,
            disks: [datastore, selected],
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions selected={[selected]} systemId="abc123" />,
      { state }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Create datastore" })
    );
    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({
        view: MachineSidePanelViews.CREATE_DATASTORE,
      })
    );
  });

  it("can trigger the create RAID sidepanel", async () => {
    const selected = [
      factory.nodeDisk({
        filesystem: null,
        type: DiskTypes.VIRTUAL,
      }),
      factory.nodeDisk({
        filesystem: null,
        type: DiskTypes.VIRTUAL,
      }),
    ];
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            detected_storage_layout: StorageLayout.FLAT,
            disks: selected,
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions selected={selected} systemId="abc123" />,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: "Create RAID" }));
    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({
        view: MachineSidePanelViews.CREATE_RAID,
      })
    );
  });

  it("can trigger the create volume group sidepanel", async () => {
    const selected = [
      factory.nodeDisk({
        filesystem: null,
        type: DiskTypes.VIRTUAL,
      }),
      factory.nodeDisk({
        filesystem: null,
        type: DiskTypes.VIRTUAL,
      }),
    ];
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            detected_storage_layout: StorageLayout.FLAT,
            disks: selected,
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions selected={selected} systemId="abc123" />,
      { state }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Create volume group" })
    );
    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({
        view: MachineSidePanelViews.CREATE_VOLUME_GROUP,
      })
    );
  });

  it("can trigger the update datastore sidepanel", async () => {
    const datastore = factory.nodeDisk({
      filesystem: factory.nodeFilesystem({ fstype: "vmfs6" }),
    });
    const selected = factory.nodeDisk({ filesystem: null, partitions: null });
    const state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            detected_storage_layout: StorageLayout.VMFS6,
            disks: [datastore, selected],
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
    });

    renderWithBrowserRouter(
      <BulkActions selected={[selected]} systemId="abc123" />,
      { state }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Add to existing datastore" })
    );
    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({
        view: MachineSidePanelViews.UPDATE_DATASTORE,
      })
    );
  });
});
