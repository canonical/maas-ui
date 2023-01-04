import { useEffect } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import VaultSettings from "./VaultSettings";

import { useWindowTitle } from "app/base/hooks";
import { actions as generalActions } from "app/store/general";
import { vaultEnabled as vaultEnabledSelectors } from "app/store/general/selectors";

const SecretStorage = (): JSX.Element => {
  const dispatch = useDispatch();
  const vaultEnabledLoaded = useSelector(vaultEnabledSelectors.loaded);
  useWindowTitle("Secret storage");

  useEffect(() => {
    dispatch(generalActions.fetchVaultEnabled());
  }, [dispatch]);

  if (!vaultEnabledLoaded) {
    return <Spinner text="Loading..." />;
  }

  return (
    <>
      <Row>
        <Col size={6}>
          <VaultSettings />
        </Col>
      </Row>
    </>
  );
};

export default SecretStorage;
