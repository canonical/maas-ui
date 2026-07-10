import { useMemo } from "react";

import { Button, Icon, Spinner, Tooltip } from "@canonical/react-components";
import type { ColumnDef, Row } from "@tanstack/react-table";

import type {
  BootSourceResponse,
  UiSourceAvailableImageResponse,
} from "@/app/apiclient";
import ImageSourceMenu from "@/app/images/components/ImageSourceMenu";
import ReleaseTitleCell from "@/app/images/components/ReleaseTitleCell";
import type { SelectedImage } from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";
import { buildSourcesByImageKey } from "@/app/images/utils";

type SelectedImageColumnDef = ColumnDef<SelectedImage, Partial<SelectedImage>>;

const useSelectedImagesTableColumns = ({
  selectedImages,
  setSelectedImages,
  sources,
  availableImages,
  isSourcesPending,
}: {
  selectedImages: SelectedImage[];
  setSelectedImages: (images: SelectedImage[]) => void;
  sources: BootSourceResponse[] | undefined;
  availableImages: UiSourceAvailableImageResponse[] | undefined;
  isSourcesPending: boolean;
}): SelectedImageColumnDef[] => {
  // Build a set of selected os/release/arch keys for fast lookup.
  const selectedKeys = useMemo(
    () =>
      new Set(
        selectedImages.map(
          (img) => `${img.os}/${img.release}/${img.architecture}`
        )
      ),
    [selectedImages]
  );

  // For each selected os/release/arch, collect every source that has that
  // image available so the dropdown always shows all switchable sources.
  const sourcesByImageKey = useMemo(
    () =>
      sources && availableImages
        ? buildSourcesByImageKey(sources, availableImages, selectedKeys)
        : {},
    [sources, availableImages, selectedKeys]
  );

  return useMemo(
    () =>
      [
        {
          id: "title",
          accessorKey: "title",
          enableSorting: false,
          header: "Release title",
          cell: ({
            row: {
              original: { release, title },
            },
          }: {
            row: Row<SelectedImage>;
          }) => <ReleaseTitleCell release={release} title={title} />,
        },
        {
          id: "architecture",
          accessorKey: "architecture",
          enableSorting: false,
          header: "Architecture",
        },
        {
          id: "source",
          accessorKey: "source",
          enableSorting: false,
          header: "Source",
          cell: ({
            row: {
              original: { os, release, architecture, source_id, id },
            },
          }: {
            row: Row<SelectedImage>;
          }) => {
            if (isSourcesPending) {
              return <Spinner text="Loading..." />;
            }

            const key = `${os}/${release}/${architecture}`;
            const switchableSources = sourcesByImageKey[key] ?? [];

            return (
              <ImageSourceMenu
                currentSourceId={source_id}
                onSourceSelect={(source) => {
                  setSelectedImages(
                    selectedImages.map((img) =>
                      img.id === id ? { ...img, source_id: source.id } : img
                    )
                  );
                }}
                sources={switchableSources}
              />
            );
          },
        },
        {
          id: "actions",
          accessorKey: "id",
          enableSorting: false,
          header: "",
          cell: ({
            row: {
              original: { id },
            },
          }: {
            row: Row<SelectedImage>;
          }) => (
            <Tooltip message="Remove" position="left">
              <Button
                appearance="base"
                className="is-dense u-table-cell-padding-overlap"
                hasIcon
                onClick={() => {
                  setSelectedImages(
                    selectedImages.filter((img) => img.id !== id)
                  );
                }}
              >
                <Icon name="close">Remove</Icon>
              </Button>
            </Tooltip>
          ),
        },
      ] as SelectedImageColumnDef[],
    [isSourcesPending, sourcesByImageKey, selectedImages, setSelectedImages]
  );
};

export default useSelectedImagesTableColumns;
