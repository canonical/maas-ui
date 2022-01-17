import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import deviceSelectors from "app/store/device/selectors";
import type { Device, DeviceMeta } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import { getTagsDisplay } from "app/store/tag/utils";

type Props = {
  systemId: Device[DeviceMeta.PK];
};

const OwnerColumn = ({ systemId }: Props): JSX.Element => {
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const deviceTags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(state, device?.tags || null)
  );

  if (!device || !tagsLoaded) {
    return <Spinner />;
  }
  const tagDisplay = getTagsDisplay(deviceTags);
  return (
    <DoubleRow
      primary={device.owner}
      primaryTitle={device.owner}
      secondary={tagDisplay}
      secondaryTitle={tagDisplay}
    />
  );
};

export default OwnerColumn;
