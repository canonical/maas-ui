import { Col, Icon, Input, Tooltip } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { ImageValue } from "app/images/types";
import type {
  BaseImageFields,
  BootResourceUbuntuArch,
  BootResourceUbuntuRelease,
} from "app/store/bootresource/types";
import configSelectors from "app/store/config/selectors";

type Props = {
  arches: BootResourceUbuntuArch[];
  release: BootResourceUbuntuRelease | BaseImageFields | null;
};

const ArchSelect = ({ arches, release }: Props): JSX.Element => {
  const commissioningRelease = useSelector(
    configSelectors.commissioningDistroSeries
  );
  const { setFieldValue, values } =
    useFormikContext<{ images: ImageValue[] }>();
  const { images } = values;
  const commissioningImages = images.filter(
    (image) => image.release === commissioningRelease
  );

  if (!release) {
    return (
      <Col className="p-divider__block" size="6">
        <h4>Architectures</h4>
        <p data-test="no-release-selected">
          Please select a release to view the available architectures.
        </p>
      </Col>
    );
  }

  const isChecked = (arch: BootResourceUbuntuArch) =>
    images.some(
      (image) =>
        image.os === "ubuntu" &&
        image.release === release.name &&
        image.arch === arch.name
    );

  const archUnsupported = (arch: BootResourceUbuntuArch) =>
    "unsupported_arches" in release &&
    release.unsupported_arches.includes(arch.name);

  const isLastCommissioningArch = (arch: BootResourceUbuntuArch) => {
    if (isChecked(arch) && release.name === commissioningRelease) {
      return commissioningImages.length <= 1;
    }
    return false;
  };

  const isDisabled = (arch: BootResourceUbuntuArch) =>
    archUnsupported(arch) || isLastCommissioningArch(arch);

  const handleChange = (arch: BootResourceUbuntuArch) => {
    let newImages: ImageValue[] = [];
    if (isChecked(arch)) {
      newImages = images.filter(
        (image) =>
          !(
            image.os === "ubuntu" &&
            image.release === release.name &&
            image.arch === arch.name
          )
      );
    } else {
      newImages = images.concat({
        arch: arch.name,
        release: release.name,
        os: "ubuntu",
        title: release.title,
      });
    }
    setFieldValue("images", newImages);
  };

  return (
    <Col className="p-divider__block" size="6">
      <h4>Architectures for {release.title}</h4>
      <ul className="p-list">
        {arches.map((arch) => (
          <li className="p-list__item u-sv1" key={arch.name}>
            <Input
              checked={isChecked(arch)}
              disabled={isDisabled(arch)}
              id={`arch-${arch.name}`}
              label={
                <span>
                  {arch.name}
                  {isDisabled(arch) && (
                    <Tooltip
                      className="u-nudge-right--small"
                      data-test="disabled-arch-tooltip"
                      message={
                        isLastCommissioningArch(arch)
                          ? "At least one architecture must be selected for the default commissioning release."
                          : `${arch.name} is not available on ${release.title}.`
                      }
                    >
                      <Icon name="help" />
                    </Tooltip>
                  )}
                </span>
              }
              onChange={() => handleChange(arch)}
              type="checkbox"
            />
          </li>
        ))}
      </ul>
    </Col>
  );
};

export default ArchSelect;
