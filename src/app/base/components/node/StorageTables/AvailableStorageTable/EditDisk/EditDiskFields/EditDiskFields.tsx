import { Col, Input, Row } from "@canonical/react-components";

import FilesystemFields from "../../FilesystemFields";

import TagNameField from "app/base/components/TagNameField";
import type { Machine } from "app/store/machine/types";
import type { Disk } from "app/store/types/node";
import { formatSize, formatType } from "app/store/utils";

type Props = {
  disk: Disk;
  systemId: Machine["system_id"];
};

export const EditDiskFields = ({ disk, systemId }: Props): JSX.Element => {
  return (
    <Row>
      <Col size={5}>
        <Input
          aria-label="Name"
          disabled
          label="Name"
          type="text"
          value={disk.name}
        />
        <Input
          aria-label="Type"
          disabled
          label="Type"
          type="text"
          value={formatType(disk)}
        />
        <Input
          aria-label="Size"
          disabled
          label="Size"
          type="text"
          value={formatSize(disk.size)}
        />
      </Col>
      <Col emptyLarge={7} size={5}>
        {disk.is_boot === false && <FilesystemFields systemId={systemId} />}
        <TagNameField />
      </Col>
    </Row>
  );
};

export default EditDiskFields;
