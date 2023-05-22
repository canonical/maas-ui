import { userEvent, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import AddLogicalVolume from "./AddLogicalVolume";

import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import { DiskTypes } from "app/store/types/enum";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  nodeDisk as diskFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("AddLogicalVolume", () => {
  it("sets the initial name correctly", () => {
    const volumeGroup = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      name: "voldemort",
      type: DiskTypes.VOLUME_GROUP,
    });
    const logicalVolumes = [
      diskFactory({
        name: "lv0",
        parent: {
          id: volumeGroup.id,
          uuid: volumeGroup.name,
          type: volumeGroup.type,
        },
        type: DiskTypes.VIRTUAL,
      }),
      diskFactory({
        name: "lv1",
        parent: {
          id: volumeGroup.id,
          uuid: volumeGroup.name,
          type: volumeGroup.type,
        },
        type: DiskTypes.VIRTUAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [volumeGroup, ...logicalVolumes],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddLogicalVolume
        closeExpanded={jest.fn()}
        disk={volumeGroup}
        systemId="abc123"
      />,
      { store, route: "" }
    );

    // Two logical volumes already exist so the next one should be lv2
    expect(screen.getByRole("textbox", { name: "name" })).toHaveValue("lv2");
  });

  it("sets the initial size to the available space", () => {
    const volumeGroup = diskFactory({
      available_size: 8000000000,
      name: "voldemort",
      type: DiskTypes.VOLUME_GROUP,
    });
    const logicalVolumes = [
      diskFactory({
        name: "lv0",
        parent: {
          id: volumeGroup.id,
          uuid: volumeGroup.name,
          type: volumeGroup.type,
        },
        type: DiskTypes.VIRTUAL,
      }),
      diskFactory({
        name: "lv1",
        parent: {
          id: volumeGroup.id,
          uuid: volumeGroup.name,
          type: volumeGroup.type,
        },
        type: DiskTypes.VIRTUAL,
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            disks: [volumeGroup, ...logicalVolumes],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddLogicalVolume
        closeExpanded={jest.fn()}
        disk={volumeGroup}
        systemId="abc123"
      />,
      { store, route: "" }
    );

    expect(screen.getByRole("textbox", { name: "size" })).toHaveValue("8");
    expect(screen.getByLabelText("Unit")).toHaveValue("GB");
  });

  it("can validate if the size meets the minimum requirement", async () => {
    const disk = diskFactory({
      available_size: 1000000000, // 1GB
      id: 1,
      type: DiskTypes.VOLUME_GROUP,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddLogicalVolume
        closeExpanded={jest.fn()}
        disk={disk}
        systemId="abc123"
      />,
      { store, route: "" }
    );

    // Set logical volume size to 0.1MB
    userEvent.type(screen.getByRole("textbox", { name: "size" }), "0.1");
    userEvent.selectOptions(screen.getByLabelText("Unit"), "MB");
    expect(
      screen.getByText(/is required to add a logical volume/i)
    ).toBeInTheDocument();
  });

  it("can validate if the size is less than available disk space", async () => {
    const disk = diskFactory({
      available_size: 1000000000, // 1GB
      id: 1,
      type: DiskTypes.VOLUME_GROUP,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddLogicalVolume
        closeExpanded={jest.fn()}
        disk={disk}
        systemId="abc123"
      />,
      { store, route: "" }
    );

    // Set logical volume size to 2GB
    userEvent.type(screen.getByRole("textbox", { name: "size" }), "2");
    expect(
      screen.getByText(/available in this volume group/i)
    ).toBeInTheDocument();
  });

  it("correctly dispatches an action to create a logical volume", async () => {
    const disk = diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      id: 1,
      type: DiskTypes.VOLUME_GROUP,
    });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ disks: [disk], system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddLogicalVolume
        closeExpanded={jest.fn()}
        disk={disk}
        systemId="abc123"
      />,
      { store, route: "" }
    );

    await submitFormikForm(screen.getByTestId("addlvol-formikform"), {
      fstype: "fat32",
      mountOptions: "noexec",
      mountPoint: "/path",
      name: "lv0",
      size: 10,
      tags: ["tag1", "tag2"],
      unit: "GB",
      volumeGroupId: 1,
    });

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/createLogicalVolume")
    ).toStrictEqual({
      meta: {
        method: "create_logical_volume",
        model: "machine",
      },
      payload: {
        params: {
          fstype: "fat32",
          mount_options: "noexec",
          mount_point: "/path",
          name: "lv0",
          size: 10000000000,
          system_id: "abc123",
          tags: ["tag1", "tag2"],
          volume_group_id: 1,
        },
      },
      type: "machine/createLogicalVolume",
    });
  });
});
