import { useCallback } from "react";

import { Strip } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikFormContent from "app/base/components/FormikFormContent";
import NonUbuntuImageSelect from "app/images/components/NonUbuntuImageSelect";
import type { ImageValue } from "app/images/types";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import { BootResourceAction } from "app/store/bootresource/types";
import {
  splitImageName,
  splitResourceName,
} from "app/store/bootresource/utils";

const OtherImagesSchema = Yup.object()
  .shape({
    images: Yup.array().of(
      Yup.object().shape({
        arch: Yup.string(),
        os: Yup.string(),
        release: Yup.string(),
        subArch: Yup.string(),
        title: Yup.string(),
      })
    ),
  })
  .defined();

export type OtherImagesValues = {
  images: ImageValue[];
};

const OtherImages = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const otherImages = useSelector(bootResourceSelectors.otherImages);
  const resources = useSelector(bootResourceSelectors.otherResources);
  const saving = useSelector(bootResourceSelectors.savingOther);
  const previousSaving = usePrevious(saving);
  const eventErrors = useSelector(bootResourceSelectors.eventErrors);
  const error = eventErrors.find(
    (error) =>
      error.event === BootResourceAction.SAVE_OTHER ||
      error.event === BootResourceAction.STOP_IMPORT
  )?.error;
  const stoppingImport = useSelector(bootResourceSelectors.stoppingImport);
  const cleanup = useCallback(() => bootResourceActions.cleanup(), []);
  const saved = previousSaving && !saving && !error;

  if (otherImages.length === 0) {
    return null;
  }

  const initialImages = resources.reduce<ImageValue[]>((images, resource) => {
    // Resources come in the form "<os-name>/<release>" e.g. "centos/centos70".
    const { os: resourceOs, release: resourceRelease } = splitResourceName(
      resource.name
    );
    // We check that the "other image" is known by the source(s).
    const image = otherImages.find((image) => {
      const { os: imageOs, release: imageRelease } = splitImageName(image.name);
      return imageOs === resourceOs && imageRelease === resourceRelease;
    });
    // If resource details are known, we add a new image value to the list.
    if (image) {
      const { arch, os, release, subArch } = splitImageName(image.name);
      images.push({
        arch,
        os,
        release,
        resourceId: resource.id,
        subArch,
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
      <Strip shallow className="u-no-padding--bottom">
        <h4>Other images</h4>
        <Formik
          enableReinitialize
          initialValues={{
            images: initialImages,
          }}
          onSubmit={(values) => {
            dispatch(cleanup());
            const params = {
              images: values.images.map(
                ({ arch, os, release, subArch = "" }) =>
                  `${os}/${arch}/${subArch}/${release}`
              ),
            };
            dispatch(bootResourceActions.saveOther(params));
          }}
          validationSchema={OtherImagesSchema}
        >
          <FormikFormContent<OtherImagesValues>
            allowUnchanged
            buttonsBordered={false}
            cleanup={cleanup}
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
            <NonUbuntuImageSelect images={otherImages} resources={resources} />
          </FormikFormContent>
        </Formik>
      </Strip>
    </>
  );
};

export default OtherImages;
