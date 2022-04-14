import { useCallback } from "react";

import { Notification, Strip } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikFormContent from "app/base/components/FormikFormContent";
import UbuntuImageSelect from "app/images/components/UbuntuImageSelect";
import type { ImageValue } from "app/images/types";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import type {
  BootResourceUbuntuSource,
  OsystemParam,
} from "app/store/bootresource/types";
import {
  BootResourceAction,
  BootResourceSourceType,
} from "app/store/bootresource/types";
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

type Props = {
  sources: BootResourceUbuntuSource[];
};

const UbuntuImages = ({ sources }: Props): JSX.Element | null => {
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
        resourceId: resource.id,
        title: resource.title,
      });
    }
    return images;
  }, []);
  const imagesDownloading = resources.some((resource) => resource.downloading);
  const canStopImport = imagesDownloading && !stoppingImport;
  const mainSource = sources.length > 0 ? sources[0] : null;
  const tooManySources = sources.length > 1;

  return (
    <>
      <hr />
      {tooManySources && (
        <Notification data-testid="too-many-sources" severity="caution">
          More than one image source exists. The UI does not support updating
          synced images when more than one source has been defined. Use the API
          to adjust your sources.
        </Notification>
      )}
      <Strip shallow>
        <Formik
          enableReinitialize
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
            const params = mainSource
              ? {
                  osystems,
                  ...mainSource,
                }
              : {
                  osystems,
                  source_type: BootResourceSourceType.MAAS_IO,
                };
            dispatch(bootResourceActions.saveUbuntu(params));
          }}
          validationSchema={UbuntuImagesSchema}
        >
          <FormikFormContent<UbuntuImagesValues>
            allowUnchanged
            buttonsBordered={false}
            cleanup={cleanup}
            editable={!tooManySources}
            errors={error}
            onSuccess={() => {
              dispatch(bootResourceActions.poll({ continuous: false }));
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
          >
            <UbuntuImageSelect
              arches={ubuntu.arches}
              releases={ubuntu.releases}
              resources={resources}
            />
          </FormikFormContent>
        </Formik>
      </Strip>
    </>
  );
};

export default UbuntuImages;
