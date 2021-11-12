import { useState } from "react";

import { Row } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import ArchSelect from "./ArchSelect";
import ReleaseSelect from "./ReleaseSelect";

import ImagesTable from "app/images/components/ImagesTable";
import type { ImageValue } from "app/images/types";
import type {
  BaseImageFields,
  BootResource,
  BootResourceUbuntuArch,
  BootResourceUbuntuRelease,
} from "app/store/bootresource/types";
import configSelectors from "app/store/config/selectors";

type Props = {
  arches: BootResourceUbuntuArch[];
  // The api returns a different release object depending on whether it was
  // synced or fetched. Fetched releases don't include unsupported_arches so we
  // need to handle both types.
  // https://bugs.launchpad.net/maas/+bug/1934610
  releases: (BootResourceUbuntuRelease | BaseImageFields)[];
  resources: BootResource[];
};

const UbuntuImageSelect = ({
  arches,
  releases,
  resources,
}: Props): JSX.Element => {
  const commissioningReleaseName = useSelector(
    configSelectors.commissioningDistroSeries
  );
  const [selectedRelease, setSelectedRelease] = useState<
    BootResourceUbuntuRelease["name"]
  >(commissioningReleaseName || "");
  const { setFieldValue, values } =
    useFormikContext<{ images: ImageValue[] }>();
  const { images } = values;
  const availableArches = arches.filter((arch) => !arch.deleted);
  const availableReleases = releases.filter((release) => !release.deleted);
  const handleClear = (image: ImageValue) => {
    const filteredImages = values.images.filter((i) => i !== image);
    setFieldValue("images", filteredImages);
  };

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
          resources={resources}
        />
      </Row>
      <div className="u-sv2"></div>
      <ImagesTable
        handleClear={handleClear}
        images={images}
        resources={resources}
      />
    </>
  );
};

export default UbuntuImageSelect;
