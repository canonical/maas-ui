import { Col, Input, Row } from "@canonical/react-components";

import FilesystemFields from "../../FilesystemFields";

import TagField from "app/base/components/TagField";
import type { Disk, Machine } from "app/store/machine/types";
import { formatSize, formatType } from "app/store/machine/utils";

type Props = {
  disk: Disk;
  systemId: Machine["system_id"];
};

export const EditDiskFields = ({ disk, systemId }: Props): JSX.Element => {
  return (
    <Row>
      <Col size="5">
        <Input disabled label="Name" type="text" value={disk.name} />
        <Input disabled label="Type" type="text" value={formatType(disk)} />
        <Input
          disabled
          label="Size"
          type="text"
          value={formatSize(disk.size)}
        />
      </Col>
      <Col emptyLarge="7" size="5">
        {disk.is_boot === false && <FilesystemFields systemId={systemId} />}
        <TagField />
      </Col>
    </Row>
  );
};

export default EditDiskFields;
