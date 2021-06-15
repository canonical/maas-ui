import { Col, Icon, Input, Tooltip } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type {
  BootResourceUbuntuArch,
  BootResourceUbuntuRelease,
  OsystemParam,
} from "app/store/bootresource/types";

type Props = {
  arches: BootResourceUbuntuArch[];
  release: BootResourceUbuntuRelease | null;
};

const ArchSelect = ({ arches, release }: Props): JSX.Element => {
  const { setFieldValue, values } =
    useFormikContext<{ osystems: OsystemParam[] }>();
  const { osystems } = values;

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
    osystems.some(
      (os) =>
        os.osystem === "ubuntu" &&
        os.release === release.name &&
        os.arches.includes(arch.name)
    );

  const isDisabled = (arch: BootResourceUbuntuArch) =>
    release.unsupported_arches.includes(arch.name);

  const handleChange = (arch: BootResourceUbuntuArch) => {
    let newOsystems: OsystemParam[] = [];
    const osystem = osystems.find((os) => os.release === release.name);

    if (osystem) {
      // If osystem already exists, either add to or remove arch from its arches
      const rest = osystems.filter((os) => os !== osystem);
      const hasArch = osystem.arches.includes(arch.name);
      newOsystems = [
        {
          ...osystem,
          arches: hasArch
            ? osystem.arches.filter((a) => a !== arch.name)
            : osystem.arches.concat(arch.name),
        },
        ...rest,
      ];
    } else {
      // Otherwise add a new osystem object
      newOsystems = osystems.concat({
        arches: [arch.name],
        osystem: "ubuntu",
        release: release.name,
      });
    }
    setFieldValue("osystems", newOsystems);
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
                      message={`${arch.name} is not available on ${release.title}.`}
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
