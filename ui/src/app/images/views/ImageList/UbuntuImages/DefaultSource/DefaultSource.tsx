import { useCallback } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikForm from "app/base/components/FormikForm";
import UbuntuImageSelect from "app/images/components/UbuntuImageSelect";
import type { ImageValue } from "app/images/types";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import { splitResourceName } from "app/store/bootresource/utils";

const DefaultSourceSchema = Yup.object()
  .shape({
    images: Yup.array().of(
      Yup.object().shape({
        arch: Yup.string(),
        os: Yup.string(),
        release: Yup.string(),
      })
    ),
  })
  .defined();

export type DefaultSourceValues = {
  images: ImageValue[];
};

const DefaultSource = (): JSX.Element => {
  const dispatch = useDispatch();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const resources = useSelector(bootResourceSelectors.ubuntuResources);
  const saving = useSelector(bootResourceSelectors.savingUbuntu);
  const cleanup = useCallback(() => bootResourceActions.cleanup(), []);

  if (!ubuntu) {
    return <Spinner text="Fetching image data..." />;
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
      });
    }
    return images;
  }, []);

  return (
    <FormikForm<DefaultSourceValues>
      buttonsBordered={false}
      cleanup={cleanup}
      initialValues={{
        images: initialImages,
      }}
      onSubmit={() => {
        dispatch(cleanup());
      }}
      saving={saving}
      submitLabel="Update selection"
      validationSchema={DefaultSourceSchema}
    >
      <UbuntuImageSelect
        arches={ubuntu.arches}
        releases={ubuntu.releases}
        resources={resources}
      />
    </FormikForm>
  );
};

export default DefaultSource;
