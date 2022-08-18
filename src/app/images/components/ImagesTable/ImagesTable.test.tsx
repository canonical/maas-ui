import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ImagesTable, { Labels as ImagesTableLabels } from "./ImagesTable";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  bootResource as resourceFactory,
  bootResourceState as bootResourceStateFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("ImagesTable", () => {
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
    expect(
      within(row).getByText(ImagesTableLabels.Selected)
    ).toBeInTheDocument();
  });

  it("can clear an image that has been selected", async () => {
    const handleClear = jest.fn();
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
    const handleClear = jest.fn();
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
    const resources = [
      resourceFactory({ arch: "amd64", name: "ubuntu/bionic" }),
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

    renderWithMockStore(
      <ImagesTable images={[image]} resources={resources} />,
      {
        state,
      }
    );

    const row = screen.getAllByRole("row", { name: image.title })[1]; // First row has no delete button since it's selected for download
    const delete_button = within(row).getByRole("button", { name: "Delete" });
    expect(delete_button).not.toBeDisabled();

    await userEvent.click(delete_button);

    expect(
      within(row).getByRole("gridcell", {
        name: ImagesTableLabels.DeleteImageConfirm,
      })
    ).toBeInTheDocument();
  });

  it(`prevents opening the delete image confirmation if the image uses the
    default commissioning release`, async () => {
    const resources = [
      resourceFactory({ arch: "amd64", name: "ubuntu/focal" }),
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

    renderWithMockStore(
      <ImagesTable images={[image]} resources={resources} />,
      {
        state,
      }
    );

    const row = screen.getByRole("row", { name: "18.04 LTS" });
    const delete_button = within(row).getByRole("button", { name: "Delete" });
    expect(delete_button).toBeDisabled();
  });
});
