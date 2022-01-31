import { useState } from "react";

import {
  Button,
  Col,
  ActionButton,
  Strip,
  Row,
} from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";
import { useCycled } from "app/base/hooks";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";
import type { Fabric } from "app/store/fabric/types";
import urls from "app/subnets/urls";

type Props = {
  fabric: Fabric;
};

const FabricDetailsHeader = ({ fabric }: Props): JSX.Element => {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const saving = useSelector(fabricSelectors.saving);
  const saved = useSelector(fabricSelectors.saved);

  const deleteFabric = () => {
    dispatch(fabricActions.delete(fabric.id));
  };

  useCycled(saved, () => {
    if (saved) {
      history.replace(urls.indexBy({ by: "fabric" }));
    }
  });

  return (
    <SectionHeader
      title={fabric.name}
      buttons={[
        <Button
          appearance="neutral"
          disabled={showConfirm}
          onClick={() => setShowConfirm(true)}
        >
          Delete fabric
        </Button>,
      ]}
      headerContent={
        showConfirm ? (
          <Strip shallow element="section">
            <Row>
              <Col size={8}>
                <p>Are you sure you want to delete {fabric.name} fabric?</p>
              </Col>
              <Col size={4} className="u-align--right">
                <ActionButton
                  appearance="negative"
                  onClick={deleteFabric}
                  disabled={saving}
                >
                  Yes, delete fabric
                </ActionButton>
                <Button onClick={() => setShowConfirm(false)} disabled={saving}>
                  No, cancel
                </Button>
              </Col>
            </Row>
          </Strip>
        ) : null
      }
    />
  );
};

export default FabricDetailsHeader;
