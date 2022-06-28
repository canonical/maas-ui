import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import UsedStorageTable from "./UsedStorageTable";

import controllerURLs from "app/controllers/urls";
import machineURLs from "app/machines/urls";
import { FilterControllers } from "app/store/controller/utils";
import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import { FilterMachines } from "app/store/machine/utils";
import { DiskTypes } from "app/store/types/enum";
import {
  controllerDetails as controllerDetailsFactory,
  machineDetails as machineDetailsFactory,
  nodeDisk as diskFactory,
} from "testing/factories";

it("can show an empty message", () => {
  const node = machineDetailsFactory({
    disks: [],
    system_id: "abc123",
  });
  render(
    <MemoryRouter>
      <CompatRouter>
        <UsedStorageTable node={node} />
      </CompatRouter>
    </MemoryRouter>
  );

  expect(
    screen.getByText("No disk or partition has been fully utilised.")
  ).toBeInTheDocument();
});

it("only shows disks that are being used", () => {
  const [availableDisk, usedDisk] = [
    diskFactory({
      available_size: MIN_PARTITION_SIZE + 1,
      name: "available-disk",
      filesystem: null,
      type: DiskTypes.PHYSICAL,
    }),
    diskFactory({
      available_size: MIN_PARTITION_SIZE - 1,
      filesystem: null,
      name: "used-disk",
      type: DiskTypes.PHYSICAL,
    }),
  ];
  const node = machineDetailsFactory({
    disks: [availableDisk, usedDisk],
    system_id: "abc123",
  });

  render(
    <MemoryRouter>
      <CompatRouter>
        <UsedStorageTable node={node} />
      </CompatRouter>
    </MemoryRouter>
  );

  expect(
    screen.getAllByRole("gridcell", { name: "Name & serial" })
  ).toHaveLength(1);
  expect(
    screen.getByRole("gridcell", { name: "Name & serial" })
  ).toHaveTextContent(usedDisk.name);
});

it("can render storage tag links for a controller", () => {
  const node = controllerDetailsFactory({
    disks: [
      diskFactory({
        available_size: MIN_PARTITION_SIZE - 1,
        type: DiskTypes.PHYSICAL,
        tags: ["abc"],
      }),
    ],
  });
  const filter = FilterControllers.filtersToQueryString({
    storage_tags: ["=abc"],
  });
  const href = `${controllerURLs.index}${filter}`;

  render(
    <MemoryRouter>
      <CompatRouter>
        <UsedStorageTable node={node} />
      </CompatRouter>
    </MemoryRouter>
  );

  expect(screen.getByRole("link", { name: "abc" })).toHaveAttribute(
    "href",
    href
  );
});

it("can render storage tag links for a machine", () => {
  const node = machineDetailsFactory({
    disks: [
      diskFactory({
        available_size: MIN_PARTITION_SIZE - 1,
        type: DiskTypes.PHYSICAL,
        tags: ["abc"],
      }),
    ],
  });
  const filter = FilterMachines.filtersToQueryString({
    storage_tags: ["=abc"],
  });
  const href = `${machineURLs.index}${filter}`;

  render(
    <MemoryRouter>
      <CompatRouter>
        <UsedStorageTable node={node} />
      </CompatRouter>
    </MemoryRouter>
  );

  expect(screen.getByRole("link", { name: "abc" })).toHaveAttribute(
    "href",
    href
  );
});
