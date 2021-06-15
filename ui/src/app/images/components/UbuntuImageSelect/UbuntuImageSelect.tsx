import { useState } from "react";

import { Row } from "@canonical/react-components";

import ArchSelect from "./ArchSelect";
import ReleaseSelect from "./ReleaseSelect";

import type {
  BootResourceUbuntuArch,
  BootResourceUbuntuRelease,
} from "app/store/bootresource/types";

type Props = {
  arches: BootResourceUbuntuArch[];
  releases: BootResourceUbuntuRelease[];
};

const UbuntuImageSelect = ({ arches, releases }: Props): JSX.Element => {
  const [selectedRelease, setSelectedRelease] =
    useState<BootResourceUbuntuRelease["name"]>("focal");
  const availableArches = arches.filter((arch) => !arch.deleted);
  const availableReleases = releases.filter((release) => !release.deleted);

  return (
    <Row className="p-divider">
      <ReleaseSelect
        releases={availableReleases}
        selectedRelease={selectedRelease}
        setSelectedRelease={setSelectedRelease}
      />
      <ArchSelect
        arches={availableArches}
        release={
          releases.find((release) => release.name === selectedRelease) || null
        }
      />
    </Row>
  );
};

export default UbuntuImageSelect;
