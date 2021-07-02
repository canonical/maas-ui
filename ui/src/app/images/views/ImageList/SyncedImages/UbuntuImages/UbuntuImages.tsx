import { useCallback } from "react";

import { Strip } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikForm from "app/base/components/FormikForm";
import UbuntuImageSelect from "app/images/components/UbuntuImageSelect";
import type { ImageValue } from "app/images/types";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import {
  BootResourceAction,
  BootResourceSourceType,
} from "app/store/bootresource/types";
import type { OsystemParam } from "app/store/bootresource/types";
import { splitResourceName } from "app/store/bootresource/utils";

const UbuntuImagesSchema = Yup.object()
  .shape({
    images: Yup.array().of(
      Yup.object().shape({
        arch: Yup.string(),
        os: Yup.string(),
        release: Yup.string(),
        title: Yup.string(),
      })
    ),
  })
  .defined();

export type UbuntuImagesValues = {
  images: ImageValue[];
};

const UbuntuImages = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const resources = useSelector(bootResourceSelectors.ubuntuResources);
  const saving = useSelector(bootResourceSelectors.savingUbuntu);
  const previousSaving = usePrevious(saving);
  const eventErrors = useSelector(bootResourceSelectors.eventErrors);
  const error = eventErrors.find(
    (error) =>
      error.event === BootResourceAction.SAVE_UBUNTU ||
      error.event === BootResourceAction.STOP_IMPORT
  )?.error;
  const stoppingImport = useSelector(bootResourceSelectors.stoppingImport);
  const cleanup = useCallback(() => bootResourceActions.cleanup(), []);
  const saved = previousSaving && !saving && !error;

  if (!ubuntu) {
    return null;
  }

  const initialImages = resources.reduce<ImageValue[]>((images, resource) => {
    // Resources come in the form "<os-name>/<release>" e.g. "ubuntu/bionic".
    const { os, release } = splitResourceName(resource.name);
    // We check that the release and arch of the resource are known by the
    // source(s).
    const releaseExists = ubuntu.releases.some(({ name }) => name === release);
    const archExists = ubuntu.arches.some(({ name }) => name === resource.arch);
    // If resource details are known, we add a new image value to the list.
    if (releaseExists && archExists) {
      images.push({
        arch: resource.arch,
        os,
        release,
        title: resource.title,
      });
    }
    return images;
  }, []);
  const imagesDownloading = resources.some((resource) => resource.downloading);
  const canStopImport = imagesDownloading && !stoppingImport;

  return (
    <>
      <hr />
      <Strip shallow>
        <FormikForm<UbuntuImagesValues>
          allowUnchanged
          buttonsBordered={false}
          cleanup={cleanup}
          enableReinitialize
          errors={error}
          initialValues={{
            images: initialImages,
          }}
          onSubmit={(values) => {
            dispatch(cleanup());
            const osystems = values.images.reduce<OsystemParam[]>(
              (osystems, image) => {
                const existingOsystem = osystems.find(
                  (os) =>
                    os.osystem === image.os && os.release === image.release
                );
                if (existingOsystem) {
                  existingOsystem.arches.push(image.arch);
                } else {
                  osystems.push({
                    arches: [image.arch],
                    osystem: image.os,
                    release: image.release,
                  });
                }
                return osystems;
              },
              []
            );
            const params = {
              osystems,
              source_type: BootResourceSourceType.MAAS_IO,
            };
            dispatch(bootResourceActions.saveUbuntu(params));
          }}
          saved={saved}
          saving={saving || stoppingImport}
          savingLabel={stoppingImport ? "Stopping image import..." : null}
          secondarySubmit={() => {
            dispatch(cleanup());
            dispatch(bootResourceActions.stopImport());
          }}
          secondarySubmitLabel={canStopImport ? "Stop import" : null}
          submitLabel="Update selection"
          validationSchema={UbuntuImagesSchema}
        >
          <UbuntuImageSelect
            arches={ubuntu.arches}
            releases={ubuntu.releases}
            resources={resources}
          />
        </FormikForm>
      </Strip>
    </>
  );
};

export default UbuntuImages;
