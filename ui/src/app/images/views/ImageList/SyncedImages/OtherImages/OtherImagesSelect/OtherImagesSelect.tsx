import { Col, Input, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { OtherImagesValues } from "../OtherImages";

import ImagesTable from "app/images/components/ImagesTable";
import type { ImageValue } from "app/images/types";
import type {
  BootResource,
  BootResourceOtherImage,
} from "app/store/bootresource/types";
import { splitImageName } from "app/store/bootresource/utils";

type Props = {
  otherImages: BootResourceOtherImage[];
  resources: BootResource[];
};

const otherImageMatchesImageValue = (
  otherImage: BootResourceOtherImage,
  imageValue: ImageValue
) => {
  const { arch, os, release, subArch } = splitImageName(otherImage.name);
  return (
    imageValue.arch === arch &&
    imageValue.os === os &&
    imageValue.release === release &&
    imageValue.subArch === subArch
  );
};

const OtherImagesSelect = ({
  otherImages,
  resources,
}: Props): JSX.Element | null => {
  const { setFieldValue, values } = useFormikContext<OtherImagesValues>();
  const { images } = values;

  const isChecked = (otherImage: BootResourceOtherImage) =>
    images.some((imageValue) =>
      otherImageMatchesImageValue(otherImage, imageValue)
    );

  const handleChange = (otherImage: BootResourceOtherImage) => {
    let newImageValues: ImageValue[] = [];
    if (isChecked(otherImage)) {
      newImageValues = images.filter(
        (imageValue) => !otherImageMatchesImageValue(otherImage, imageValue)
      );
    } else {
      const { arch, os, release, subArch } = splitImageName(otherImage.name);
      newImageValues = images.concat({
        arch,
        os,
        release,
        subArch,
        title: otherImage.title,
      });
    }
    setFieldValue("images", newImageValues);
  };

  return (
    <>
      <Row>
        <Col size="12">
          <ul className="p-list">
            {otherImages.map((image, i) => (
              <li className="p-list__item u-sv1" key={`${image.name}-${i}`}>
                <Input
                  checked={isChecked(image)}
                  id={`other-image-${image.name}`}
                  label={image.title}
                  onChange={() => handleChange(image)}
                  type="checkbox"
                />
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <ImagesTable images={images} resources={resources} />
    </>
  );
};

export default OtherImagesSelect;
