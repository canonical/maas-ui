import { Formik } from "formik";

import {
  getDownloadableImages,
  groupArchesByRelease,
  groupImagesByOS,
} from "@/app/images/components/SMImagesTable/DownloadImages/DownloadImages";
import DownloadImagesSelect from "@/app/images/components/SMImagesTable/DownloadImages/DownloadImagesSelect/DownloadImagesSelect";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

describe("DownloadImagesSelect", () => {
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

  it("does not show a radio button for a release deleted from the source", () => {
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
    renderWithMockStore(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        {({ values, setFieldValue }: { values: any; setFieldValue: any }) => (
          <DownloadImagesSelect
            groupedImages={groupedImages}
            setFieldValue={setFieldValue}
            values={values}
          />
        )}
      </Formik>,
      { state }
    );

    expect(
      screen.queryByRole("row", { name: "20.10" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("row", { name: "20.04 LTS" })).toBeInTheDocument();
  });

  it("does not show a checkbox for an architecture delete from the source", () => {
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
    renderWithMockStore(
      <Formik initialValues={{ images: [] }} onSubmit={vi.fn()}>
        {({ values, setFieldValue }: { values: any; setFieldValue: any }) => (
          <DownloadImagesSelect
            groupedImages={groupedImages}
            setFieldValue={setFieldValue}
            values={values}
          />
        )}
      </Formik>,
      { state }
    );

    const checkboxes = screen.getAllByRole("checkbox", {
      hidden: true,
    });

    const labels = checkboxes
      .map((checkbox) => checkbox.closest("label"))
      .filter((label) => label?.classList.contains("p-checkbox"));

    expect(labels).toHaveLength(1);
    expect(labels[0]).toHaveTextContent("available");
  });
});
