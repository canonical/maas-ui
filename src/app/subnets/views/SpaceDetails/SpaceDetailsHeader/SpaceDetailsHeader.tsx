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
      buttons={[
        <Button disabled={isDeleteOpen} onClick={() => setIsDeleteOpen(true)}>
          Delete space
        </Button>,
      ]}
      headerContent={
        isDeleteOpen ? (
          <SpaceDelete
            handleClose={() => setIsDeleteOpen(false)}
            space={space}
          />
        ) : null
      }
      title={space.name}
    />
  );
};

export default SpaceDetailsHeader;
