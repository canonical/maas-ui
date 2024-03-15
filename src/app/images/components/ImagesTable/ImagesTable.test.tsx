import MockDate from "mockdate";
import timezoneMock from "timezone-mock";

import ImagesTable, { Labels as ImagesTableLabels } from "./ImagesTable";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { ImageSidePanelViews } from "@/app/images/constants";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import {
  bootResource as resourceFactory,
  bootResourceState as bootResourceStateFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import {
  userEvent,
  screen,
  within,
  renderWithMockStore,
} from "@/testing/utils";

beforeEach(() => {
  MockDate.set("Fri, 18 Nov. 2022 10:55:00");
  timezoneMock.register("Etc/GMT-1");
});

afterEach(() => {
  MockDate.reset();
});

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    bootresource: bootResourceStateFactory({
      resources: [],
    }),
    config: configStateFactory({
      items: [
        configFactory({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });
});

it("renders the correct status for a downloaded image that is selected", () => {
  const resource = resourceFactory({
    arch: "amd64",
    complete: true,
    name: "ubuntu/focal",
    title: "20.04 LTS",
  });
  state.bootresource.resources = [resource];
  renderWithMockStore(
    <ImagesTable
      images={[
        {
          arch: resource.arch,
          os: "ubuntu",
          release: "focal",
          resourceId: resource.id,
          title: resource.title,
        },
      ]}
      resources={[resource]}
    />,
    { state }
  );

  const row = screen.getByRole("row", { name: resource.title });

  expect(within(row).getByText(resource.status)).toBeInTheDocument();
  expect(
    within(row).getByLabelText(ImagesTableLabels.Success)
  ).toBeInTheDocument();
});

it("renders the correct status for a downloaded image that is not selected", () => {
  const resource = resourceFactory({
    arch: "amd64",
    complete: true,
    name: "ubuntu/focal",
    title: "20.04 LTS",
  });
  state.bootresource.resources = [resource];
  renderWithMockStore(<ImagesTable images={[]} resources={[resource]} />, {
    state,
  });

  const row = screen.getByRole("row", { name: resource.title });

  expect(
    within(row).getByLabelText(ImagesTableLabels.Error)
  ).toBeInTheDocument();
  expect(
    within(row).getByText(ImagesTableLabels.WillBeDeleted)
  ).toBeInTheDocument();
});

it("renders the time of last update", () => {
  const lastUpdate = "Mon, 30 Jan. 2023 15:54:44";
  const resource = resourceFactory({
    arch: "amd64",
    complete: true,
    name: "ubuntu/focal",
    title: "20.04 LTS",
    status: "Synced",
    lastUpdate,
  });
  state.bootresource.resources = [resource];
  renderWithMockStore(<ImagesTable images={[]} resources={[resource]} />, {
    state,
  });

  const row = screen.getByRole("row", { name: resource.title });

  expect(within(row).getByText(lastUpdate)).toBeInTheDocument();
});

it("renders the correct data for a new image", () => {
  const image = {
    arch: "arch",
    os: "os",
    release: "release",
    title: "New release",
  };
  renderWithMockStore(<ImagesTable images={[image]} resources={[]} />, {
    state,
  });

  const row = screen.getByRole("row", { name: image.title });

  expect(within(row).getByText("New release")).toBeInTheDocument();
  expect(
    within(row).getByLabelText(ImagesTableLabels.Pending)
  ).toBeInTheDocument();
  expect(within(row).getByText(ImagesTableLabels.Selected)).toBeInTheDocument();
});

it("can clear an image that has been selected", async () => {
  const handleClear = vi.fn();
  const image = {
    arch: "arch",
    os: "os",
    release: "release",
    title: "New release",
  };
  renderWithMockStore(
    <ImagesTable handleClear={handleClear} images={[image]} resources={[]} />,
    { state }
  );

  const row = screen.getByRole("row", { name: image.title });
  await userEvent.click(within(row).getByRole("button", { name: "Clear" }));

  expect(handleClear).toHaveBeenCalledWith(image);
});

it(`can not clear a selected image if it is the last image that uses the
    default commissioning release`, () => {
  const handleClear = vi.fn();
  const image = {
    arch: "amd64",
    os: "ubuntu",
    release: "focal",
    title: "Ubuntu 20.04 LTS",
  };
  renderWithMockStore(
    <ImagesTable handleClear={handleClear} images={[image]} resources={[]} />,
    { state }
  );

  const row = screen.getByRole("row", { name: image.title });
  expect(within(row).getByRole("button", { name: "Clear" })).toBeDisabled();
});

it(`can open the delete image confirmation if the image does not use the
    default commissioning release`, async () => {
  const setSidePanelContent = vi.fn();
  vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
    setSidePanelContent,
    sidePanelContent: null,
    setSidePanelSize: vi.fn(),
    sidePanelSize: "regular",
  });
  const resources = [
    resourceFactory({ arch: "amd64", name: "ubuntu/bionic", complete: true }),
  ];
  const image = {
    arch: "amd64",
    os: "ubuntu",
    release: "bionic",
    title: "18.04 LTS",
  };
  const state = rootStateFactory({
    bootresource: bootResourceStateFactory({
      resources,
    }),
    config: configStateFactory({
      items: [
        configFactory({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });

  renderWithMockStore(<ImagesTable images={[image]} resources={resources} />, {
    state,
  });

  const row = screen.getAllByRole("row", { name: image.title })[1]; // First row has no delete button since it's selected for download
  const delete_button = within(row).getByRole("button", { name: "Delete" });
  expect(delete_button).not.toBeDisabled();

  await userEvent.click(delete_button);

  expect(setSidePanelContent).toHaveBeenCalledWith(
    expect.objectContaining({
      view: ImageSidePanelViews.DELETE_IMAGE,
    })
  );
});

it("disables delete for default commissioning release images", async () => {
  const resources = [resourceFactory({ arch: "amd64", name: "ubuntu/focal" })];
  const image = {
    arch: "amd64",
    os: "ubuntu",
    release: "focal",
    title: "20.04 LTS",
  };
  const state = rootStateFactory({
    bootresource: bootResourceStateFactory({
      resources,
    }),
    config: configStateFactory({
      items: [
        configFactory({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });

  renderWithMockStore(<ImagesTable images={[image]} resources={resources} />, {
    state,
  });

  const row = screen.getByRole("row", { name: "18.04 LTS" });
  const deleteButton = within(row).getByRole("button", { name: "Delete" });
  expect(deleteButton).toBeDisabled();
  await userEvent.hover(deleteButton);

  // Assert that the delete button has the correct tooltip
  expect(deleteButton).toHaveAccessibleDescription(
    "Cannot delete images of the default commissioning release."
  );
});

it("disables delete action for images being downloaded", async () => {
  const resources = [
    resourceFactory({
      arch: "amd64",
      name: "ubuntu/bionic",
      title: "18.04 LTS",
      complete: false,
      status: "Downloading 50%",
    }),
  ];
  const image = {
    arch: "amd64",
    os: "ubuntu",
    release: "bionic",
    title: "18.04 LTS",
    resourceId: resources[0].id,
  };
  state.bootresource.resources = resources;
  renderWithMockStore(<ImagesTable images={[image]} resources={resources} />, {
    state,
  });

  const row = screen.getByRole("row", { name: image.title });

  expect(within(row).getByText("Downloading 50%")).toBeInTheDocument();

  const deleteButton = within(row).getByRole("button", { name: "Delete" });

  expect(deleteButton).toBeDisabled();
  await userEvent.hover(deleteButton);

  expect(deleteButton).toHaveAccessibleDescription(
    "Cannot delete images that are currently being imported."
  );
});

it("displays a correct last deployed time and machine count", () => {
  const lastDeployed = "Fri, 18 Nov. 2022 09:55:21";
  const resources = [
    resourceFactory({
      arch: "amd64",
      name: "ubuntu/focal",
      lastDeployed,
      machineCount: 768,
    }),
  ];
  const image = {
    arch: "amd64",
    os: "ubuntu",
    release: "focal",
    title: "20.04 LTS",
  };
  const state = rootStateFactory({
    bootresource: bootResourceStateFactory({
      resources,
    }),
    config: configStateFactory({
      items: [
        configFactory({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });

  renderWithMockStore(<ImagesTable images={[image]} resources={resources} />, {
    state,
  });

  expect(
    screen.getByRole("columnheader", { name: /Last deployed/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("columnheader", { name: /Machines/i })
  ).toBeInTheDocument();
  const row = screen.getByRole("row", { name: "18.04 LTS" });
  expect(within(row).getByText(lastDeployed)).toBeInTheDocument();
  expect(
    within(row).getByRole("gridcell", { name: /about 1 hour ago/ })
  ).toBeInTheDocument();
  expect(
    within(row).getByRole("gridcell", { name: /768/ })
  ).toBeInTheDocument();
});

it("can handle empty string for last deployed time", () => {
  const resources = [
    resourceFactory({
      arch: "amd64",
      name: "ubuntu/focal",
      lastDeployed: "",
      machineCount: 768,
    }),
  ];
  const image = {
    arch: "amd64",
    os: "ubuntu",
    release: "focal",
    title: "20.04 LTS",
  };
  const state = rootStateFactory({
    bootresource: bootResourceStateFactory({
      resources,
    }),
    config: configStateFactory({
      items: [
        configFactory({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });

  renderWithMockStore(<ImagesTable images={[image]} resources={resources} />, {
    state,
  });

  expect(
    screen.getByRole("columnheader", { name: /Last deployed/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("columnheader", { name: /Machines/i })
  ).toBeInTheDocument();
  const row = screen.getByRole("row", { name: "18.04 LTS" });
  expect(within(row).getByRole("gridcell", { name: "—" })).toBeInTheDocument();
});

it("can sort by last deployed time", async () => {
  // resources sorted by last deployed time
  const resourcesByLastDeployed = [
    resourceFactory({
      name: "ubuntu/xenial",
      arch: "amd64",
      title: "16.04 LTS",
      lastDeployed: "Tue, 16 Nov. 2022 09:55:21",
    }),
    resourceFactory({
      arch: "amd64",
      name: "ubuntu/focal",
      title: "20.04 LTS",
      lastDeployed: "Thu, 17 Nov. 2022 09:55:21",
      machineCount: 768,
    }),
    resourceFactory({
      name: "ubuntu/bionic",
      arch: "i386",
      title: "18.04 LTS",
      lastDeployed: "Wed, 18 Nov. 2022 08:55:21",
    }),
  ];
  const state = rootStateFactory({
    bootresource: bootResourceStateFactory({
      resources: resourcesByLastDeployed,
    }),
    config: configStateFactory({
      items: [
        configFactory({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });

  renderWithMockStore(
    <ImagesTable images={[]} resources={resourcesByLastDeployed} />,
    {
      state,
    }
  );
  await userEvent.click(
    screen.getByRole("columnheader", { name: /Last deployed/i })
  );
  const tableBody = screen.getAllByRole("rowgroup")[1];
  const getRows = () => within(tableBody).getAllByRole("row");
  expect(getRows()).toHaveLength(resourcesByLastDeployed.length);
  getRows().forEach((row, i) => {
    expect(row).toHaveTextContent(resourcesByLastDeployed[i].title);
  });
  await userEvent.click(
    screen.getByRole("columnheader", { name: /Last deployed/i })
  );
  // expect rows in a reverse sort order
  const resourcesByLastDeployedReverse = [...resourcesByLastDeployed].reverse();
  getRows().forEach((row, i) => {
    expect(row).toHaveTextContent(resourcesByLastDeployedReverse[i].title);
  });
});

it("sorts by release by default", () => {
  // resources sorted by release
  const resourcesByReleaseTitle = [
    resourceFactory({
      arch: "amd64",
      name: "ubuntu/focal",
      title: "20.04 LTS",
      lastDeployed: "Thu, 17 Nov. 2022 09:55:21",
      machineCount: 768,
    }),
    resourceFactory({
      name: "ubuntu/bionic",
      arch: "i386",
      title: "18.04 LTS",
      lastDeployed: "Wed, 18 Nov. 2022 08:55:21",
    }),
    resourceFactory({
      name: "ubuntu/xenial",
      arch: "amd64",
      title: "16.04 LTS",
      lastDeployed: "Tue, 16 Nov. 2022 09:55:21",
    }),
  ];
  const state = rootStateFactory({
    bootresource: bootResourceStateFactory({
      resources: resourcesByReleaseTitle,
    }),
    config: configStateFactory({
      items: [
        configFactory({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });

  renderWithMockStore(
    <ImagesTable images={[]} resources={resourcesByReleaseTitle} />,
    {
      state,
    }
  );
  // verify rows are sorted by release by default
  expect(
    screen.getByRole("columnheader", { name: /Release/i })
  ).toHaveAttribute("aria-sort", "descending");
  const tableBody = screen.getAllByRole("rowgroup")[1];
  const rows = within(tableBody).getAllByRole("row");
  expect(rows).toHaveLength(3);
  rows.forEach((row, i) => {
    expect(row).toHaveTextContent(resourcesByReleaseTitle[i].title);
  });
});

it("can show support for deploying to memory", async () => {
  const supported_resource = resourceFactory({ canDeployToMemory: true });
  const unsupported_resource = resourceFactory({ canDeployToMemory: false });
  renderWithMockStore(
    <ImagesTable
      handleClear={vi.fn()}
      images={[]}
      resources={[supported_resource, unsupported_resource]}
    />,
    { state }
  );

  const tableBody = screen.getAllByRole("rowgroup")[1];
  const rows = within(tableBody).getAllByRole("row");

  expect(
    within(rows[0]).getByRole("gridcell", { name: "supported" })
  ).toBeInTheDocument();
  expect(
    within(rows[1]).getByRole("gridcell", { name: "not supported" })
  ).toBeInTheDocument();

  await userEvent.click(
    within(rows[0]).getByRole("button", { name: "supported" })
  );

  expect(
    screen.getByRole("tooltip", {
      name: "This image can be deployed in memory.",
    })
  ).toBeInTheDocument();

  await userEvent.click(
    within(rows[1]).getByRole("button", { name: "not supported" })
  );

  expect(
    screen.getByRole("tooltip", {
      name: "This image cannot be deployed in memory.",
    })
  ).toBeInTheDocument();
});
