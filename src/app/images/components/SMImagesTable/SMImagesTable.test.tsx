import MockDate from "mockdate";
import timezoneMock from "timezone-mock";
import { expect, vi } from "vitest";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import SMImagesTable from "@/app/images/components/SMImagesTable/SMImagesTable";
import { ImageSidePanelViews } from "@/app/images/constants";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithMockStore,
  screen,
  userEvent,
  waitFor,
  within,
} from "@/testing/utils";

beforeEach(() => {
  MockDate.set("Fri, 18 Nov. 2022 10:55:00");
  timezoneMock.register("Etc/GMT-1");
});

afterEach(() => {
  MockDate.reset();
  timezoneMock.unregister();
});

let state: RootState;

beforeEach(() => {
  const ubuntu = factory.bootResourceUbuntu({
    arches: [
      {
        name: "amd64",
        title: "amd64",
        checked: false,
        deleted: false,
      },
    ],
    releases: [
      {
        name: "focal",
        title: "20.04 LTS",
        unsupported_arches: [],
        checked: false,
        deleted: false,
      },
    ],
  });
  const resources = [
    factory.bootResource({
      name: "ubuntu/focal",
      arch: "amd64",
      title: "20.04 LTS",
      complete: true,
    }),
  ];
  state = factory.rootState({
    bootresource: factory.bootResourceState({
      resources,
      ubuntu,
    }),
  });
});

it("renders the correct status for an image", () => {
  renderWithMockStore(<SMImagesTable />, { state });

  const cell = screen.getByText("20.04 LTS");

  const row = cell.closest("tr")!;
  expect(
    within(row).getByText(state.bootresource.resources[0].status)
  ).toBeInTheDocument();
  expect(within(row).getByText("Loading")).toBeInTheDocument();
});

it("renders the time of last update", () => {
  const lastUpdate = factory.timestamp("Mon, 30 Jan. 2023 15:54:44");
  const resource = factory.bootResource({
    arch: "amd64",
    complete: true,
    name: "ubuntu/focal",
    title: "20.04 LTS",
    status: "Synced",
    lastUpdate,
  });
  state.bootresource.resources = [resource];
  renderWithMockStore(<SMImagesTable />, {
    state,
  });

  const cell = screen.getByText("20.04 LTS");

  const row = cell.closest("tr")!;

  expect(within(row).getByText(lastUpdate)).toBeInTheDocument();
});

it("can open the delete image confirmation if the image does not use the default commissioning release", async () => {
  const setSidePanelContent = vi.fn();
  vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
    setSidePanelContent,
    sidePanelContent: null,
    setSidePanelSize: vi.fn(),
    sidePanelSize: "regular",
  });
  const resources = [
    factory.bootResource({
      arch: "amd64",
      name: "ubuntu/bionic",
      complete: true,
    }),
  ];
  const state = factory.rootState({
    bootresource: factory.bootResourceState({
      resources,
    }),
    config: factory.configState({
      items: [
        factory.config({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });

  renderWithMockStore(<SMImagesTable />, {
    state,
  });

  const cell = screen.getByText("18.04 LTS");

  const row = cell.closest("tr")!;
  const delete_button = within(row).getByRole("button", { name: "Delete" });
  expect(delete_button).not.toBeAriaDisabled();

  await userEvent.click(delete_button);

  expect(setSidePanelContent).toHaveBeenCalledWith(
    expect.objectContaining({
      view: ImageSidePanelViews.DELETE_MULTIPLE_IMAGES,
      extras: {
        rowSelection: { [resources[0].id]: true },
        setRowSelection: expect.any(Function),
      },
    })
  );
});

it("disables delete for default commissioning release images", async () => {
  const resources = [
    factory.bootResource({ arch: "amd64", name: "ubuntu/focal" }),
  ];
  const state = factory.rootState({
    bootresource: factory.bootResourceState({
      resources,
    }),
    config: factory.configState({
      items: [
        factory.config({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });

  renderWithMockStore(<SMImagesTable />, {
    state,
  });

  const cell = screen.getByText("18.04 LTS");

  const row = cell.closest("tr")!;
  const deleteButton = within(row).getByRole("button", { name: "Delete" });
  expect(deleteButton).toBeAriaDisabled();
  await userEvent.hover(deleteButton);

  await waitFor(() => {
    expect(deleteButton).toHaveAccessibleDescription(
      "Cannot delete images of the default commissioning release."
    );
  });
});

it("disables delete action for images being downloaded", async () => {
  state.bootresource.resources = [
    factory.bootResource({
      arch: "amd64",
      name: "ubuntu/bionic",
      title: "18.04 LTS",
      complete: false,
      status: "Downloading 50%",
      downloading: true,
    }),
  ];
  renderWithMockStore(<SMImagesTable />, {
    state,
  });

  const cell = screen.getByText("18.04 LTS");

  const row = cell.closest("tr")!;

  expect(within(row).getByText("Downloading 50%")).toBeInTheDocument();

  const deleteButton = within(row).getByRole("button", { name: "Delete" });

  expect(deleteButton).toBeAriaDisabled();
  await userEvent.hover(deleteButton);

  await waitFor(() => {
    expect(deleteButton).toHaveAccessibleDescription(
      "Cannot delete images that are currently being imported."
    );
  });
});

it("sorts by release by default", () => {
  const resourcesByReleaseTitle = [
    factory.bootResource({
      arch: "amd64",
      name: "ubuntu/focal",
      title: "20.04 LTS",
      lastDeployed: factory.timestamp("Thu, 17 Nov. 2022 09:55:21"),
      machineCount: 768,
    }),
    factory.bootResource({
      name: "ubuntu/bionic",
      arch: "i386",
      title: "18.04 LTS",
      lastDeployed: factory.timestamp("Wed, 18 Nov. 2022 08:55:21"),
    }),
    factory.bootResource({
      name: "ubuntu/xenial",
      arch: "amd64",
      title: "16.04 LTS",
      lastDeployed: factory.timestamp("Tue, 16 Nov. 2022 09:55:21"),
    }),
  ];
  const state = factory.rootState({
    bootresource: factory.bootResourceState({
      resources: resourcesByReleaseTitle,
    }),
    config: factory.configState({
      items: [
        factory.config({
          name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
          value: "focal",
        }),
      ],
    }),
  });

  renderWithMockStore(<SMImagesTable />, {
    state,
  });

  const colHeader = screen.getByRole("columnheader", {
    name: /Release title/i,
  });

  expect(within(colHeader).getByText("descending")).toBeInTheDocument();
  const tableBody = screen.getAllByRole("rowgroup")[1];
  const rows = within(tableBody).getAllByRole("row");
  expect(rows).toHaveLength(4); // resourceByReleaseTitle.len + 1 because of group row
  rows.slice(1).forEach((row, i) => {
    expect(row).toHaveTextContent(resourcesByReleaseTitle[i].title);
  });
});
