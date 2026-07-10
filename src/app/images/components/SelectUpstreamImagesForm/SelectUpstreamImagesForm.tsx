import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import type { MultiSelectItem } from "@canonical/react-components";
import {
  Notification as NotificationBanner,
  Spinner,
  Strip,
} from "@canonical/react-components";

import SelectUpstreamImagesSelect, {
  getValueKey,
} from "./SelectUpstreamImagesSelect";
import type { DownloadImagesSelectProps } from "./SelectUpstreamImagesSelect/SelectUpstreamImagesSelect";

import { useImageSources } from "@/app/api/query/imageSources";
import { useAvailableSelections, useSelections } from "@/app/api/query/images";
import type {
  ImageResponse,
  UiSourceAvailableImageResponse,
} from "@/app/apiclient";
import FormikForm from "@/app/base/components/FormikForm";
import type {
  SelectedImage,
  SelectUpstreamImagesStepValues,
} from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";
import { SelectUpstreamImagesSteps } from "@/app/images/components/SelectUpstreamImages/SelectUpstreamImages";

import "./_index.scss";

export type GroupedImages = Record<string, ReleasesWithArches>;

type ReleasesWithArches = Record<string, MultiSelectItem[]>;

type ImagesByOS = Record<string, DownloadableImage[]>;

type DownloadableImage = {
  id: string;
  title: string;
  release: string;
  architectures: string;
  os: string;
};

export const getDownloadableImages = (
  availableImages: UiSourceAvailableImageResponse[]
): DownloadableImage[] => {
  const seen = new Set<string>();
  return availableImages.reduce<DownloadableImage[]>((acc, image) => {
    const id = `${image.os}&${image.release}&${image.title}&${image.architecture}`;
    if (!seen.has(id)) {
      seen.add(id);
      acc.push({
        id,
        title: image.title,
        release: image.release,
        architectures: image.architecture,
        os: image.os.charAt(0).toUpperCase() + image.os.slice(1),
      });
    }
    return acc;
  }, []);
};

export const filterSyncedImages = (
  downloadableImages: DownloadableImage[],
  selectedImages: ImageResponse[]
): DownloadableImage[] => {
  return downloadableImages.filter((image) => {
    const [os, release, _title, arch] = image.id.split("&");

    return !selectedImages.some(
      (selected) =>
        selected.os.toLowerCase() === os.toLowerCase() &&
        selected.release === release &&
        selected.architecture === arch
    );
  });
};

export const groupImagesByOS = (images: DownloadableImage[]): ImagesByOS => {
  const imagesByOS: ImagesByOS = {};

  images.forEach((image) => {
    if (!!imagesByOS[image.os]) {
      imagesByOS[image.os].push(image);
    } else {
      imagesByOS[image.os] = [image];
    }
  });

  Object.keys(imagesByOS).forEach((distro) => {
    imagesByOS[distro].sort((a, b) => {
      const aIsLTS = a.title.endsWith("LTS");
      const bIsLTS = b.title.endsWith("LTS");

      if (aIsLTS && !bIsLTS) return -1;
      if (!aIsLTS && bIsLTS) return 1;

      return b.title.localeCompare(a.title);
    });
  });

  return imagesByOS;
};

export const groupArchesByTitle = (images: ImagesByOS): GroupedImages => {
  const groupedImages: GroupedImages = {};

  Object.keys(images).forEach((distro) => {
    if (!groupedImages[distro]) {
      groupedImages[distro] = {};
    }
    images[distro].forEach((image) => {
      if (!groupedImages[distro][`${image.title}&${image.release}`]) {
        groupedImages[distro][`${image.title}&${image.release}`] = [
          { label: image.architectures.toString(), value: image.id },
        ];
      } else {
        groupedImages[distro][`${image.title}&${image.release}`].push({
          label: image.architectures.toString(),
          value: image.id,
        });
      }
    });
  });

  return groupedImages;
};

const SelectUpstreamImagesForm = ({
  setStep,
  setSelectedImages,
}: {
  setStep: (step: SelectUpstreamImagesStepValues) => void;
  setSelectedImages: (images: SelectedImage[]) => void;
}): ReactElement => {
  const { closeSidePanel } = useSidePanel();

  const { data: selectedImages, isPending: isSelectedImagesPending } =
    useSelections();
  const { data: availableImages, isPending: isAvailableImagesPending } =
    useAvailableSelections();
  const { data: sources } = useImageSources();

  const [groupedImages, setGroupedImages] = useState<GroupedImages>({});

  const isPending = isSelectedImagesPending || isAvailableImagesPending;

  useEffect(() => {
    if (selectedImages && availableImages) {
      const downloadableImages = getDownloadableImages(availableImages.items);
      const filteredDownloadableImages = filterSyncedImages(
        downloadableImages,
        selectedImages.items
      );
      const imagesByOS = groupImagesByOS(filteredDownloadableImages);
      const grouped = groupArchesByTitle(imagesByOS);
      setGroupedImages(grouped);
    }
  }, [availableImages, selectedImages]);

  const initialValues = useMemo(() => {
    const initial: Record<string, MultiSelectItem[]> = {};
    Object.keys(groupedImages).forEach((distro) => {
      Object.keys(groupedImages[distro]).forEach((key) => {
        const [title, release] = key.split("&");
        const fieldKey = getValueKey(distro, release, title);
        initial[fieldKey] = [];
      });
    });
    return initial;
  }, [groupedImages]);

  const noAvailableImages = availableImages?.items.length === 0;

  return (
    <div className="select-upstream-images-form">
      Select images to be imported and kept in sync daily. Images will be
      available for deployment on MAAS managed machines.
      <Strip shallow>
        {isPending ? (
          <Spinner text="Loading..." />
        ) : (
          <>
            {noAvailableImages && (
              <NotificationBanner
                data-testid="no-available-images-warning"
                severity="caution"
              >
                No available upstream images found. This could be caused by an
                ongoing image source change. If you recently changed the image
                source settings, please come back after some time.
              </NotificationBanner>
            )}
            <FormikForm
              aria-label="Select upstream images to sync"
              buttonsBehavior="independent"
              enableReinitialize
              initialValues={initialValues}
              onCancel={closeSidePanel}
              onSubmit={(values) => {
                const allSelectedItems = Object.values(
                  values as Record<string, { label: string; value: string }[]>
                ).flat();
                const selectedItemIds = new Set(
                  allSelectedItems.map((item) => item.value)
                );

                // Group all available images by selection key (no source_id).
                const groupedByKey = new Map<
                  string,
                  UiSourceAvailableImageResponse[]
                >();
                for (const img of availableImages?.items ?? []) {
                  const id = `${img.os}&${img.release}&${img.title}&${img.architecture}`;
                  if (!selectedItemIds.has(id)) continue;
                  if (!groupedByKey.has(id)) groupedByKey.set(id, []);
                  groupedByKey.get(id)!.push(img);
                }

                // For each group, default to the enabled source with the
                // lowest numeric priority, falling back to the first candidate.
                const nextSelectedImages: SelectedImage[] = [];
                for (const [id, candidates] of groupedByKey) {
                  const best =
                    candidates
                      .filter(
                        (img) =>
                          sources?.items.find((s) => s.id === img.source_id)
                            ?.enabled
                      )
                      .sort((a, b) => {
                        const priA =
                          sources?.items.find((s) => s.id === a.source_id)
                            ?.priority ?? Infinity;
                        const priB =
                          sources?.items.find((s) => s.id === b.source_id)
                            ?.priority ?? Infinity;
                        return priA - priB;
                      })[0] ?? candidates[0];
                  nextSelectedImages.push({ ...best, id });
                }

                setSelectedImages(nextSelectedImages);
                setStep(SelectUpstreamImagesSteps.SOURCE_CONFIGURATION);
              }}
              submitLabel="Next"
            >
              {({
                values,
                setFieldValue,
              }: Pick<
                DownloadImagesSelectProps,
                "setFieldValue" | "values"
              >) => (
                <SelectUpstreamImagesSelect
                  groupedImages={groupedImages}
                  setFieldValue={setFieldValue}
                  values={values}
                />
              )}
            </FormikForm>
          </>
        )}
      </Strip>
    </div>
  );
};

export default SelectUpstreamImagesForm;
