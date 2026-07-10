import { useMemo } from "react";

import type { MenuLink } from "@canonical/react-components";
import {
  Button,
  ContextualMenu,
  Icon,
  Spinner,
  Tooltip,
} from "@canonical/react-components";
import type { ColumnDef, Row } from "@tanstack/react-table";

import { useImageSources } from "@/app/api/query/imageSources";
import { useAvailableSelections } from "@/app/api/query/images";
import type { BootSourceResponse } from "@/app/apiclient";
import type { SelectedImage } from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";

type SelectedImageColumnDef = ColumnDef<SelectedImage, Partial<SelectedImage>>;

const useSelectedImagesTableColumns = ({
  selectedImages,
  setSelectedImages,
}: {
  selectedImages: SelectedImage[];
  setSelectedImages: (images: SelectedImage[]) => void;
}): SelectedImageColumnDef[] => {
  const { data: sources, isPending: isSourcesPending } = useImageSources();
  const { data: availableImages } = useAvailableSelections();

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
  // image available. This is derived from the full availableImages list so
  // the dropdown always shows all switchable sources, not just the initially
  // assigned one.
  const sourcesByImageKey = useMemo(() => {
    const map: Record<string, BootSourceResponse[]> = {};
    if (!sources?.items || !availableImages?.items) return map;

    for (const img of availableImages.items) {
      const key = `${img.os}/${img.release}/${img.architecture}`;
      if (!selectedKeys.has(key)) continue;
      const source = sources.items.find((s) => s.id === img.source_id);
      if (!source) continue;
      if (!map[key]) {
        map[key] = [source];
      } else if (!map[key].some((s) => s.id === source.id)) {
        map[key].push(source);
      }
    }
    return map;
  }, [sources, availableImages, selectedKeys]);

  return useMemo(
    () =>
      [
        {
          id: "title",
          accessorKey: "title",
          enableSorting: true,
          header: "Release title",
          cell: ({
            row: {
              original: { release, title },
            },
          }: {
            row: Row<SelectedImage>;
          }) => {
            return (
              <div>
                <div>{title}</div>
                {title !== release ? (
                  <small className="u-text--muted">{release}</small>
                ) : null}
              </div>
            );
          },
        },
        {
          id: "architecture",
          accessorKey: "architecture",
          enableSorting: true,
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
            const currentSource = switchableSources.find(
              (source) => source.id === source_id
            );

            return (
              <ContextualMenu
                className="p-table-menu"
                hasToggleIcon
                links={[
                  "Change source:",
                  ...switchableSources.map(
                    (source): MenuLink => ({
                      disabled: source.id === currentSource?.id,
                      children: source.name,
                      onClick: () => {
                        setSelectedImages(
                          selectedImages.map((img) =>
                            img.id === id
                              ? { ...img, source_id: source.id }
                              : img
                          )
                        );
                      },
                    })
                  ),
                ]}
                position="right"
                toggleAppearance="base"
                toggleClassName="u-no-margin--bottom p-table-menu__toggle"
                toggleLabel={currentSource?.name}
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
          }) => {
            return (
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
            );
          },
        },
      ] as SelectedImageColumnDef[],
    [isSourcesPending, sourcesByImageKey, selectedImages, setSelectedImages]
  );
};

export default useSelectedImagesTableColumns;
