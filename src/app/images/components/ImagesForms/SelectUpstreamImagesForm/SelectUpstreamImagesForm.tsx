import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

import type { MultiSelectItem } from "@canonical/react-components";
import { Notification, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import SelectUpstreamImagesSelect from "./SelectUpstreamImagesSelect";
import type { DownloadImagesSelectProps } from "./SelectUpstreamImagesSelect/SelectUpstreamImagesSelect";

import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import type {
  BaseImageFields,
  BootResource,
  BootResourceUbuntuArch,
  BootResourceUbuntuRelease,
} from "@/app/store/bootresource/types";
import {
  BootResourceSourceType,
  BootResourceAction,
} from "@/app/store/bootresource/types";

import "./_index.scss";

export type GroupedImages = Record<string, ReleasesWithArches>;

type ReleasesWithArches = Record<string, MultiSelectItem[]>;

type ImagesByOS = Record<string, DownloadableImage[]>;

type DownloadableImage = {
  id: string;
  name: string;
  release: string;
  architectures: string;
  subArchitectures?: string;
  os: string;
};

export const getDownloadableImages = (
  ubuntuReleases: BootResourceUbuntuRelease[],
  ubuntuArches: BootResourceUbuntuArch[],
  otherReleases: BaseImageFields[]
): DownloadableImage[] => {
  const ubuntuImages = ubuntuReleases
    .filter((release) => !release.deleted)
    .map((image) => {
      return ubuntuArches
        .filter((arche) => !arche.deleted)
        .map((arch) => {
          return {
            id: `ubuntu-${image.name}-${image.title}-${arch.name}`,
            name: image.name,
            release: image.title,
            architectures: arch.name,
            os: "Ubuntu",
          };
        });
    })
    .flat();

  const otherImages = otherReleases
    .map((image) => {
      const [os, architecture, subArchitecture, release] =
        image.name.split("/");
      return {
        id: `${os}-${release}-${architecture}-${subArchitecture}`,
        name: image.title,
        release: release,
        architectures: architecture,
        subArchitecture: subArchitecture,
        os: os.charAt(0).toUpperCase() + os.slice(1),
      };
    })
    .flat();

  return [...ubuntuImages, ...otherImages];
};

export const getSyncedImages = (
  downloadableImages: DownloadableImage[],
  resources: BootResource[]
): Record<string, { label: string; value: string }[]> => {
  return downloadableImages
    .filter((image) => {
      return resources.some(
        (resource) =>
          (resource.title === image.release || resource.title === image.name) &&
          resource.arch === image.architectures
      );
    })
    .reduce<Record<string, { label: string; value: string }[]>>(
      (acc, image) => {
        const key = `${image.os}-${image.release.replace(".", "-")}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push({
          label: image.architectures,
          value: image.id,
        });
        return acc;
      },
      {}
    );
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
  const dispatch = useDispatch();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const otherImages = useSelector(bootResourceSelectors.otherImages);
  const resources = useSelector(bootResourceSelectors.resources);

  const sources = ubuntu?.sources || [];
  const [groupedImages, setGroupedImages] = useState<GroupedImages>({});
  const [syncedImages, setSyncedImages] = useState({});

  const eventErrors = useSelector(bootResourceSelectors.eventErrors);
  const error = eventErrors.find(
    (error) =>
      error.event === BootResourceAction.SAVE_UBUNTU ||
      error.event === BootResourceAction.STOP_IMPORT
  )?.error;
  const cleanup = useCallback(() => bootResourceActions.cleanup(), []);

  const mainSource = sources.length > 0 ? sources[0] : null;
  const tooManySources = sources.length > 1;

  useEffect(() => {
    if (ubuntu && resources && otherImages) {
      const downloadableImages = getDownloadableImages(
        ubuntu.releases,
        ubuntu.arches,
        otherImages
      );
      setSyncedImages(getSyncedImages(downloadableImages, resources));
      const imagesByOS = groupImagesByOS(downloadableImages);
      setGroupedImages(groupArchesByRelease(imagesByOS));
    }
  }, [ubuntu, resources, otherImages]);

  useEffect(() => {
    return () => {
      dispatch(bootResourceActions.cleanup());
    };
  }, [dispatch]);

  const { setSidePanelContent } = useSidePanel();

  const resetForm = () => {
    setSidePanelContent(null);
  };

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
        <FormikForm
          allowUnchanged
          buttonsBehavior="independent"
          cleanup={cleanup}
          editable={!tooManySources}
          enableReinitialize
          errors={error}
          initialValues={syncedImages}
          onCancel={resetForm}
          onSubmit={(values) => {
            dispatch(cleanup());
            const ubuntuSystems: {
              arches: string[];
              osystem: string;
              release: string;
            }[] = [];
            const otherSystems: {
              arch: string;
              os: string;
              release: string;
              subArch: string;
            }[] = [];
            Object.entries(
              values as Record<string, { label: string; value: string }[]>
            ).forEach(([key, images]) => {
              const [osystem] = key.split("-", 1);

              if (osystem === "Ubuntu") {
                const arches = images.map((image) => image.label);
                const release = images[0].value.split("-")[1];
                ubuntuSystems.push({
                  arches,
                  osystem: osystem.toLowerCase(),
                  release,
                });
              } else {
                const [os, release, arch, subArch] = images[0].value.split("-");
                otherSystems.push({
                  arch,
                  os,
                  release,
                  subArch,
                });
              }
            });

            if (ubuntuSystems.length > 0) {
              const params = mainSource
                ? {
                    osystems: ubuntuSystems,
                    ...mainSource,
                  }
                : {
                    osystems: ubuntuSystems,
                    source_type: BootResourceSourceType.MAAS_IO,
                  };
              dispatch(bootResourceActions.saveUbuntu(params));
              dispatch(bootResourceActions.saveUbuntuSuccess());
            }

            if (otherSystems.length > 0) {
              const params = {
                images: otherSystems.map(
                  ({ arch, os, release, subArch = "" }) =>
                    `${os}/${arch}/${subArch}/${release}`
                ),
              };
              dispatch(bootResourceActions.saveOther(params));
              dispatch(bootResourceActions.saveOtherSuccess());
            }
            resetForm();
          }}
          onSuccess={() => {
            dispatch(bootResourceActions.poll({ continuous: false }));
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
      </Strip>
    </div>
  );
};

export default SelectUpstreamImagesForm;
