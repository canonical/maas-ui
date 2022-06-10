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
        <Button disabled={isDeleteOpen} onClick={() => setIsDeleteOpen(true)}>
          Delete space
        </Button>,
      ]}
      headerContent={
        isDeleteOpen ? (
          <SpaceDelete
            space={space}
            handleClose={() => setIsDeleteOpen(false)}
          />
        ) : null
      }
    />
  );
};

export default SpaceDetailsHeader;
