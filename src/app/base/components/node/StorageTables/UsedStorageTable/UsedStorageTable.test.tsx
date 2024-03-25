import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import UsedStorageTable from "./UsedStorageTable";

import urls from "@/app/base/urls";
import { FilterControllers } from "@/app/store/controller/utils";
import { MIN_PARTITION_SIZE } from "@/app/store/machine/constants";
import { FilterMachines } from "@/app/store/machine/utils";
import { DiskTypes } from "@/app/store/types/enum";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

it("can show an empty message", () => {
  const node = factory.machineDetails({
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
    factory.nodeDisk({
      available_size: MIN_PARTITION_SIZE + 1,
      name: "available-disk",
      filesystem: null,
      type: DiskTypes.PHYSICAL,
    }),
    factory.nodeDisk({
      available_size: MIN_PARTITION_SIZE - 1,
      filesystem: null,
      name: "used-disk",
      type: DiskTypes.PHYSICAL,
    }),
  ];
  const node = factory.machineDetails({
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
  const node = factory.controllerDetails({
    disks: [
      factory.nodeDisk({
        available_size: MIN_PARTITION_SIZE - 1,
        type: DiskTypes.PHYSICAL,
        tags: ["abc"],
      }),
    ],
  });
  const filter = FilterControllers.filtersToQueryString({
    storage_tags: ["=abc"],
  });
  const href = `${urls.controllers.index}${filter}`;

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
  const node = factory.machineDetails({
    disks: [
      factory.nodeDisk({
        available_size: MIN_PARTITION_SIZE - 1,
        type: DiskTypes.PHYSICAL,
        tags: ["abc"],
      }),
    ],
  });
  const filter = FilterMachines.filtersToQueryString({
    storage_tags: ["=abc"],
  });
  const href = `${urls.machines.index}${filter}`;

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
