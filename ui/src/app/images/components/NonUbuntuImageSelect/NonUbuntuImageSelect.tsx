import { Col, Input, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import ImagesTable from "app/images/components/ImagesTable";
import type { ImageValue } from "app/images/types";
import type {
  BaseImageFields,
  BootResource,
} from "app/store/bootresource/types";
import {
  splitImageName,
  splitResourceName,
} from "app/store/bootresource/utils";

type Props = {
  images: BaseImageFields[];
  resources: BootResource[];
};

const imageMatchesValue = (image: BaseImageFields, imageValue: ImageValue) => {
  const { arch, os, release, subArch } = splitImageName(image.name);
  return (
    imageValue.arch === arch &&
    imageValue.os === os &&
    imageValue.release === release &&
    imageValue.subArch === subArch
  );
};

const NonUbuntuImageSelect = ({
  images,
  resources,
}: Props): JSX.Element | null => {
  const { setFieldValue, values } =
    useFormikContext<{ images: ImageValue[] }>();

  const isChecked = (image: BaseImageFields) =>
    values.images.some((imageValue) => imageMatchesValue(image, imageValue));

  const handleChange = (image: BaseImageFields) => {
    let newImageValues: ImageValue[] = [];
    if (isChecked(image)) {
      newImageValues = values.images.filter(
        (imageValue) => !imageMatchesValue(image, imageValue)
      );
    } else {
      const { arch, os, release, subArch } = splitImageName(image.name);
      // First we check if the boot resource already exists in the database, in
      // which case we include a reference id in the image data. Otherwise, a
      // new boot resource will be created from the image data.
      const existingResource = resources.find((resource) => {
        const { os: resourceOs, release: resourceRelease } = splitResourceName(
          resource.name
        );
        return (
          resourceOs === os &&
          resourceRelease === release &&
          resource.arch === arch
        );
      });
      newImageValues = values.images.concat({
        arch,
        os,
        release,
        resourceId: existingResource?.id,
        subArch,
        title: image.title,
      });
    }
    setFieldValue("images", newImageValues);
  };

  const handleClear = (image: ImageValue) => {
    const filteredImages = values.images.filter((i) => i !== image);
    setFieldValue("images", filteredImages);
  };

  return (
    <>
      <Row>
        <Col size={12}>
          <ul className="p-list">
            {images.map((image, i) => (
              <li className="p-list__item u-sv1" key={`${image.name}-${i}`}>
                <Input
                  checked={isChecked(image)}
                  id={`image-${image.name}`}
                  label={image.title}
                  onChange={() => handleChange(image)}
                  type="checkbox"
                />
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <ImagesTable
        handleClear={handleClear}
        images={values.images}
        resources={resources}
      />
    </>
  );
};

export default NonUbuntuImageSelect;
