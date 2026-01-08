import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import type { MultiSelectItem } from "@canonical/react-components";
import { Spinner, Notification, Strip } from "@canonical/react-components";

import SelectUpstreamImagesSelect from "./SelectUpstreamImagesSelect";
import type { DownloadImagesSelectProps } from "./SelectUpstreamImagesSelect/SelectUpstreamImagesSelect";

import { useImageSources } from "@/app/api/query/imageSources";
import {
  useAddSelections,
  useAvailableSelections,
  useSelections,
} from "@/app/api/query/images";
import type {
  ImageResponse,
  SelectionRequest,
  UiSourceAvailableImageResponse,
} from "@/app/apiclient";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

import "./_index.scss";

export type GroupedImages = Record<string, ReleasesWithArches>;

type ReleasesWithArches = Record<string, MultiSelectItem[]>;

type ImagesByOS = Record<string, DownloadableImage[]>;

type DownloadableImage = {
  id: string;
  release: string;
  architectures: string;
  os: string;
};

export const getDownloadableImages = (
  availableImages: UiSourceAvailableImageResponse[]
): DownloadableImage[] => {
  return availableImages
    .map((image) => {
      return {
        id: `${image.os}&${image.release}&${image.architecture}&${image.source_id}`,
        release: image.release,
        architectures: image.architecture,
        os: image.os.charAt(0).toUpperCase() + image.os.slice(1),
      };
    })
    .flat();
};

export const filterSyncedImages = (
  downloadableImages: DownloadableImage[],
  selectedImages: ImageResponse[]
): DownloadableImage[] => {
  return downloadableImages.filter((image) => {
    const [os, release, arch] = image.id.split("&");

    return !selectedImages.some(
      (selected) =>
        selected.os === os &&
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
      const aIsLTS = a.release.endsWith("LTS");
      const bIsLTS = b.release.endsWith("LTS");

      if (aIsLTS && !bIsLTS) return -1;
      if (!aIsLTS && bIsLTS) return 1;

      return b.release.localeCompare(a.release);
    });
  });

  return imagesByOS;
};

export const groupArchesByRelease = (images: ImagesByOS): GroupedImages => {
  const groupedImages: GroupedImages = {};

  Object.keys(images).forEach((distro) => {
    if (!groupedImages[distro]) {
      groupedImages[distro] = {};
    }
    images[distro].forEach((image) => {
      if (!groupedImages[distro][image.release]) {
        groupedImages[distro][image.release] = [
          { label: image.architectures.toString(), value: image.id },
        ];
      } else {
        groupedImages[distro][image.release].push({
          label: image.architectures.toString(),
          value: image.id,
        });
      }
    });
  });

  return groupedImages;
};

const SelectUpstreamImagesForm = (): ReactElement => {
  const { closeSidePanel } = useSidePanel();

  const { data: sources, isPending: isSourcesPending } = useImageSources();
  const { data: selectedImages, isPending: isSelectedImagesPending } =
    useSelections();
  const { data: availableImages, isPending: isAvailableImagesPending } =
    useAvailableSelections();

  const addSelections = useAddSelections();

  const [groupedImages, setGroupedImages] = useState<GroupedImages>({});

  const isPending =
    isSourcesPending || isSelectedImagesPending || isAvailableImagesPending;
  const tooManySources = (sources?.total ?? 0) > 1;

  useEffect(() => {
    if (selectedImages && availableImages) {
      const downloadableImages = getDownloadableImages(availableImages.items);
      const filteredDownloadableImages = filterSyncedImages(
        downloadableImages,
        selectedImages.items
      );
      const imagesByOS = groupImagesByOS(filteredDownloadableImages);
      setGroupedImages(groupArchesByRelease(imagesByOS));
    }
  }, [availableImages, selectedImages]);

  return (
    <div className="select-upstream-images-form">
      Select images to be imported and kept in sync daily. Images will be
      available for deployment on MAAS managed machines.
      {tooManySources && (
        <Notification data-testid="too-many-sources" severity="caution">
          More than one image source exists. The UI does not support updating
          synced images when more than one source has been defined. Use the API
          to adjust your sources.
        </Notification>
      )}
      <Strip shallow>
        {isPending ? (
          <Spinner text="Loading..." />
        ) : (
          <FormikForm
            allowUnchanged
            buttonsBehavior="independent"
            editable={!tooManySources}
            enableReinitialize
            errors={addSelections.error}
            initialValues={{}}
            onCancel={closeSidePanel}
            onSubmit={(values) => {
              const formSelectedImages = Object.entries(
                values as Record<string, { label: string; value: string }[]>
              ).flatMap(([_, images]): SelectionRequest[] => {
                return images.map((image): SelectionRequest => {
                  const [os, release, arch, boot_source_id] =
                    image.value.split("&");
                  return {
                    arch,
                    boot_source_id: Number(boot_source_id),
                    os,
                    release,
                  };
                });
              });

              addSelections.mutate({
                body: formSelectedImages,
              });
              closeSidePanel();
            }}
            submitLabel="Save and sync"
          >
            {({
              values,
              setFieldValue,
            }: Pick<DownloadImagesSelectProps, "setFieldValue" | "values">) => (
              <SelectUpstreamImagesSelect
                groupedImages={groupedImages}
                setFieldValue={setFieldValue}
                values={values}
              />
            )}
          </FormikForm>
        )}
      </Strip>
    </div>
  );
};

export default SelectUpstreamImagesForm;
