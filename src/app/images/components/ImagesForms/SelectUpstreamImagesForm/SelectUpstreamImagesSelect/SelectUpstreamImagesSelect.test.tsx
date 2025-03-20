import { Formik } from "formik";

import {
  getDownloadableImages,
  groupArchesByRelease,
  groupImagesByOS,
} from "@/app/images/components/ImagesForms/SelectUpstreamImagesForm/SelectUpstreamImagesForm";
import type { DownloadImagesSelectProps } from "@/app/images/components/ImagesForms/SelectUpstreamImagesForm/SelectUpstreamImagesSelect/SelectUpstreamImagesSelect";
import SelectUpstreamImagesSelect, {
  getValueKey,
} from "@/app/images/components/ImagesForms/SelectUpstreamImagesForm/SelectUpstreamImagesSelect/SelectUpstreamImagesSelect";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, userEvent, renderWithProviders } from "@/testing/utils";

describe("SelectUpstreamImagesSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "focal",
          }),
        ],
        loaded: true,
        loading: false,
      }),
    });
  });

  it("does not show a radio button for a release deleted from the source", async () => {
    const [available, deleted] = [
      factory.bootResourceUbuntuRelease({
        name: "available",
        deleted: false,
        title: "20.04 LTS",
      }),
      factory.bootResourceUbuntuRelease({
        name: "deleted",
        deleted: true,
        title: "20.10",
      }),
    ];
    const arches = [factory.bootResourceUbuntuArch()];

    const downloadableImages = getDownloadableImages(
      [available, deleted],
      arches,
      []
    );
    const imagesByOS = groupImagesByOS(downloadableImages);
    const groupedImages = groupArchesByRelease(imagesByOS);
    renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        {({
          values,
          setFieldValue,
        }: Pick<DownloadImagesSelectProps, "values" | "setFieldValue">) => (
          <SelectUpstreamImagesSelect
            groupedImages={groupedImages}
            setFieldValue={setFieldValue}
            values={values}
          />
        )}
      </Formik>,
      { state }
    );

    await userEvent.click(screen.getByText("Ubuntu"));

    expect(
      screen.queryByRole("row", { name: "20.10" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("row", { name: "20.04 LTS" })).toBeInTheDocument();
  });

  it("does not show a checkbox for an architecture delete from the source", async () => {
    const releases = [factory.bootResourceUbuntuRelease({ name: "focal" })];
    const [available, deleted] = [
      factory.bootResourceUbuntuArch({
        name: "available",
        deleted: false,
      }),
      factory.bootResourceUbuntuArch({
        name: "delete",
        deleted: true,
      }),
    ];

    const downloadableImages = getDownloadableImages(
      releases,
      [available, deleted],
      []
    );
    const imagesByOS = groupImagesByOS(downloadableImages);
    const groupedImages = groupArchesByRelease(imagesByOS);
    renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        {({
          values,
          setFieldValue,
        }: Pick<DownloadImagesSelectProps, "values" | "setFieldValue">) => (
          <SelectUpstreamImagesSelect
            groupedImages={groupedImages}
            setFieldValue={setFieldValue}
            values={values}
          />
        )}
      </Formik>,
      { state }
    );

    await userEvent.click(screen.getByText("Ubuntu"));

    const combobox = screen.getByRole("combobox");

    await userEvent.click(combobox);

    const checkboxes = screen.getAllByRole("checkbox");

    const labels = checkboxes
      .map((checkbox) => checkbox.closest("label"))
      .filter((label) => label?.classList.contains("p-checkbox"));

    expect(labels).toHaveLength(1);
    expect(labels[0]).toHaveTextContent("available");
  });

  it("correctly calls setFieldValue", async () => {
    const releases = [factory.bootResourceUbuntuRelease({ name: "focal" })];
    const [available, deleted] = [
      factory.bootResourceUbuntuArch({
        name: "arch-1",
        deleted: false,
      }),
      factory.bootResourceUbuntuArch({
        name: "arch-2",
        deleted: false,
      }),
    ];

    const downloadableImages = getDownloadableImages(
      releases,
      [available, deleted],
      []
    );
    const imagesByOS = groupImagesByOS(downloadableImages);
    const groupedImages = groupArchesByRelease(imagesByOS);
    const mockSetFieldValue = vi.fn();
    renderWithProviders(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        {({ values }: Pick<DownloadImagesSelectProps, "values">) => (
          <SelectUpstreamImagesSelect
            groupedImages={groupedImages}
            setFieldValue={mockSetFieldValue}
            values={values}
          />
        )}
      </Formik>,
      { state }
    );

    await userEvent.click(screen.getByText("Ubuntu"));

    const combobox = screen.getByRole("combobox");

    await userEvent.click(combobox);

    const checkbox = screen.getAllByRole("checkbox")[0];

    await userEvent.click(checkbox);

    expect(mockSetFieldValue).toHaveBeenCalledWith(
      getValueKey("Ubuntu", releases[0].title),
      [groupedImages.Ubuntu[releases[0].title][0]]
    );
  });
});
