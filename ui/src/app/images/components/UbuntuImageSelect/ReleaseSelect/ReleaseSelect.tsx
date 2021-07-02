import { Col, Input, Row } from "@canonical/react-components";

import type { BootResourceUbuntuRelease } from "app/store/bootresource/types";
import { simpleSortByKey } from "app/utils";

type Props = {
  releases: BootResourceUbuntuRelease[];
  selectedRelease: BootResourceUbuntuRelease["name"];
  setSelectedRelease: (release: BootResourceUbuntuRelease["name"]) => void;
};

const ReleaseSelect = ({
  releases,
  selectedRelease,
  setSelectedRelease,
}: Props): JSX.Element => {
  const [ltsReleases, nonLtsReleases] = releases.reduce<
    BootResourceUbuntuRelease[][]
  >(
    ([lts, nonLts], release, i) => {
      if (release.title.includes("LTS")) {
        lts.push(release);
      } else {
        nonLts.push(release);
      }
      if (i === releases.length - 1) {
        lts.sort(simpleSortByKey("title", { reverse: true }));
        nonLts.sort(simpleSortByKey("title", { reverse: true }));
      }
      return [lts, nonLts];
    },
    [[], []]
  );

  return (
    <Col className="p-divider__block" size="6">
      <h4>Ubuntu releases</h4>
      <Row>
        <Col size="3">
          <ul className="p-list" data-test="lts-releases">
            {ltsReleases.map((release) => (
              <li className="p-list__item u-sv1" key={release.name}>
                <Input
                  checked={selectedRelease === release.name}
                  id={`release-${release.name}`}
                  label={release.title}
                  onChange={() => setSelectedRelease(release.name)}
                  type="radio"
                />
              </li>
            ))}
          </ul>
        </Col>
        <Col size="3">
          <ul className="p-list" data-test="non-lts-releases">
            {nonLtsReleases.map((release) => (
              <li className="p-list__item u-sv1" key={release.name}>
                <Input
                  checked={selectedRelease === release.name}
                  id={`release-${release.name}`}
                  label={release.title}
                  onChange={() => setSelectedRelease(release.name)}
                  type="radio"
                />
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Col>
  );
};

export default ReleaseSelect;
