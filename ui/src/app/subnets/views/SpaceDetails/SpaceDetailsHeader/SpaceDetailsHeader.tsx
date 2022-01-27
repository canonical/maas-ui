import { useState } from "react";

import { Button } from "@canonical/react-components";

import SpaceDelete from "./SpaceDelete";

import SectionHeader from "app/base/components/SectionHeader";
import type { Space } from "app/store/space/types";

type Props = {
  space: Space;
};

const SpaceDetailsHeader = ({ space }: Props): JSX.Element => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  return (
    <SectionHeader
      title={space.name}
      buttons={[
        <Button
          appearance="negative"
          disabled={isDeleteOpen}
          onClick={() => setIsDeleteOpen(true)}
        >
          Delete
        </Button>,
      ]}
      headerContent={
        isDeleteOpen ? (
          <SpaceDelete
            name={space.name}
            id={space.id}
            handleCancel={() => setIsDeleteOpen(false)}
            handleDelete={() => setIsDeleteOpen(false)}
          />
        ) : null
      }
    />
  );
};

export default SpaceDetailsHeader;
