import type { ReactElement } from "react";

import { Button } from "@canonical/react-components";

import SectionHeader from "@/app/base/components/SectionHeader";
import { useModal } from "@/app/base/modal-context";
import { DeleteSpace } from "@/app/networks/views/Spaces/components";
import type { Space } from "@/app/store/space/types";

type SpaceDetailsHeaderProps = {
  space: Space | null;
};

const SpaceDetailsHeader = ({
  space,
}: SpaceDetailsHeaderProps): ReactElement => {
  const { openModal, isOpen } = useModal();
  return (
    <SectionHeader
      buttons={[
        <Button
          disabled={isOpen || !space}
          onClick={() => {
            openModal({
              component: DeleteSpace,
              title: "Delete space",
              props: { id: space!.id },
            });
          }}
        >
          Delete space
        </Button>,
      ]}
      loading={!space}
      title={space?.name}
    />
  );
};

export default SpaceDetailsHeader;
