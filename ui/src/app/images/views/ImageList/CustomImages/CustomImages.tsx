import { Strip } from "@canonical/react-components";
import { Formik } from "formik";
import { useSelector } from "react-redux";

import ImagesTable from "app/images/components/ImagesTable";
import type { ImageValue } from "app/images/types";
import bootResourceSelectors from "app/store/bootresource/selectors";
import { splitResourceName } from "app/store/bootresource/utils";

const CustomImages = (): JSX.Element | null => {
  const uploadedResources = useSelector(
    bootResourceSelectors.uploadedResources
  );

  if (uploadedResources.length === 0) {
    return null;
  }

  const images = uploadedResources.reduce<ImageValue[]>((images, resource) => {
    const { os, release } = splitResourceName(resource.name);
    images.push({
      arch: resource.arch,
      os,
      release,
      title: resource.title,
    });
    return images;
  }, []);

  return (
    <>
      <hr />
      <Strip shallow>
        <h4>Custom images</h4>
        {/* ImagesTable requires formik context in order to be used in conjunction
          with the image selection checkboxes for synced resources,
          so we wrap it in Formik despite these resources being uploaded */}
        <Formik initialValues={{ images }} onSubmit={() => undefined}>
          <ImagesTable resources={uploadedResources} />
        </Formik>
      </Strip>
    </>
  );
};

export default CustomImages;
