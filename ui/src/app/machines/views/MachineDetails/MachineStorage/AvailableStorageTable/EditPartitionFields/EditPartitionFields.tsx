import { Col, Input, Row } from "@canonical/react-components";

import FilesystemFields from "../FilesystemFields";

import type { Machine, Partition } from "app/store/machine/types";
import { formatSize, formatType } from "app/store/machine/utils";

type Props = {
  partition: Partition;
  systemId: Machine["system_id"];
};

export const EditPartitionFields = ({
  partition,
  systemId,
}: Props): JSX.Element => {
  return (
    <Row>
      <Col size="5">
        <Input disabled label="Name" value={partition.name} type="text" />
        <Input
          disabled
          label="Type"
          value={formatType(partition)}
          type="text"
        />
        <Input
          disabled
          label="Size"
          value={formatSize(partition.size)}
          type="text"
        />
      </Col>
      <Col emptyLarge="7" size="5">
        <FilesystemFields systemId={systemId} />
      </Col>
    </Row>
  );
};

export default EditPartitionFields;
