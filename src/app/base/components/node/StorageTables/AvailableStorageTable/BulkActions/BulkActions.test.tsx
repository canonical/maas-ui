import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { BulkAction } from "../AvailableStorageTable";

import BulkActions from "./BulkActions";

import { DiskTypes, StorageLayout } from "app/store/types/enum";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  nodeFilesystem as fsFactory,
  nodePartition as partitionFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("BulkActions", () => {
  it("disables create volume group button with tooltip if selected devices are not eligible", () => {
    const selected = [
      diskFactory({
        partitions: [partitionFactory()],
        type: DiskTypes.PHYSICAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: selected,
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions
        bulkAction={null}
        selected={selected}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    expect(
      screen.getByRole("button", { name: "Create volume group" })
    ).toBeDisabled();
    expect(
      screen.getByRole("tooltip", {
        name: "Select one or more unpartitioned and unformatted storage devices to create a volume group.",
      })
    ).toBeInTheDocument();
  });

  it("enables create volume group button if selected devices are eligible", () => {
    const selected = [
      diskFactory({ partitions: null, type: DiskTypes.PHYSICAL }),
      partitionFactory({ filesystem: null }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions
        bulkAction={null}
        selected={selected}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    expect(
      screen.getByRole("button", { name: "Create volume group" })
    ).not.toBeDisabled();
  });

  it("renders datastore bulk actions if the detected layout is a VMWare layout", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            detected_storage_layout: StorageLayout.VMFS7,
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions
        bulkAction={null}
        selected={[]}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    expect(screen.getByTestId("vmware-bulk-actions")).toBeInTheDocument();
  });

  it(`enables the create datastore button if at least one unpartitioned and
    unformatted device is selected`, () => {
    const selected = [diskFactory({ filesystem: null, partitions: null })];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            detected_storage_layout: StorageLayout.VMFS6,
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions
        bulkAction={null}
        selected={selected}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    expect(
      screen.getByRole("button", { name: "Create datastore" })
    ).not.toBeDisabled();
  });

  it(`enables the add to existing datastore button if at least one unpartitioned
    and unformatted device is selected and at least one datastore exists`, () => {
    const datastore = diskFactory({
      filesystem: fsFactory({ fstype: "vmfs6" }),
    });
    const selected = diskFactory({ filesystem: null, partitions: null });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            detected_storage_layout: StorageLayout.VMFS6,
            disks: [datastore, selected],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions
        bulkAction={null}
        selected={[selected]}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    expect(
      screen.getByRole("button", { name: "Add to existing datastore" })
    ).not.toBeDisabled();
  });

  it("can render the create datastore form", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions
        bulkAction={BulkAction.CREATE_DATASTORE}
        selected={[]}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    // Ensure correct form inputs are shown
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Size" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Filesystem" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create datastore" })
    ).toBeInTheDocument();
  });

  it("can render the create RAID form", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions
        bulkAction={BulkAction.CREATE_RAID}
        selected={[]}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    // Ensure the correct form inputs are shown
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "RAID level" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Size" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Tags" })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Filesystem" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Mount point" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Mount options" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create RAID" })
    ).toBeInTheDocument();
  });

  it("can render the create volume group form", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions
        bulkAction={BulkAction.CREATE_VOLUME_GROUP}
        selected={[]}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    // Ensure the correct form inputs are shown
    expect(
      screen.getByRole("button", { name: "Create volume group" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Size" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Type" })).toBeInTheDocument();
  });

  it("can render the update datastore form", () => {
    const datastore = diskFactory({
      filesystem: fsFactory({ fstype: "vmfs6" }),
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
            disks: [datastore],
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    renderWithBrowserRouter(
      <BulkActions
        bulkAction={BulkAction.UPDATE_DATASTORE}
        selected={[]}
        setBulkAction={jest.fn()}
        systemId="abc123"
      />,
      { state }
    );

    // Ensure the correct form inputs are shown
    expect(
      screen.getByRole("combobox", { name: "Datastore" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Mount point" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Size to add" })
    ).toBeInTheDocument();
  });
});
