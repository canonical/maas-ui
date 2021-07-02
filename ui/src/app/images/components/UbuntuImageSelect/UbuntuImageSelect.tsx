import { useState } from "react";

import { Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import ArchSelect from "./ArchSelect";
import ReleaseSelect from "./ReleaseSelect";

import ImagesTable from "app/images/components/ImagesTable";
import type { ImageValue } from "app/images/types";
import type {
  BootResource,
  BootResourceUbuntuArch,
  BootResourceUbuntuRelease,
} from "app/store/bootresource/types";

type Props = {
  arches: BootResourceUbuntuArch[];
  releases: BootResourceUbuntuRelease[];
  resources: BootResource[];
};

const UbuntuImageSelect = ({
  arches,
  releases,
  resources,
}: Props): JSX.Element => {
  const [selectedRelease, setSelectedRelease] =
    useState<BootResourceUbuntuRelease["name"]>("focal");
  const { values } = useFormikContext<{ images: ImageValue[] }>();
  const { images } = values;
  const availableArches = arches.filter((arch) => !arch.deleted);
  const availableReleases = releases.filter((release) => !release.deleted);

  return (
    <>
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
      <div className="u-sv2"></div>
      <ImagesTable images={images} resources={resources} />
    </>
  );
};

export default UbuntuImageSelect;
