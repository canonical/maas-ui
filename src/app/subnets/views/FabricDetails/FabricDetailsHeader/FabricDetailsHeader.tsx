import { useState } from "react";

import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import FabricDeleteForm from "./FabricDeleteForm";

import SectionHeader from "app/base/components/SectionHeader";
import authSelectors from "app/store/auth/selectors";
import type { Fabric } from "app/store/fabric/types";

type Props = {
  fabric: Fabric;
};

const FabricDetailsHeader = ({ fabric }: Props): JSX.Element => {
  const isAdmin = useSelector(authSelectors.isAdmin);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  return (
    <SectionHeader
      buttons={
        isAdmin
          ? [
              <Button
                appearance="neutral"
                onClick={() => setShowDeleteForm(true)}
              >
                Delete fabric
              </Button>,
            ]
          : null
      }
      headerContent={
        showDeleteForm ? (
          <FabricDeleteForm
            closeForm={() => setShowDeleteForm(false)}
            id={fabric.id}
          />
        ) : null
      }
      sidePanelTitle="Delete fabric"
      title={fabric.name}
    />
  );
};

export default FabricDetailsHeader;
