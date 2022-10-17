import { useEffect } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import TLSDisabled from "./TLSDisabled";
import TLSEnabled from "./TLSEnabled";
import VaultSettings from "./VaultSettings";

import { useWindowTitle } from "app/base/hooks";
import { actions as generalActions } from "app/store/general";
import {
  tlsCertificate as tlsCertificateSelectors,
  vaultEnabled as vaultEnabledSelectors,
} from "app/store/general/selectors";

const Security = (): JSX.Element => {
  const dispatch = useDispatch();
  const tlsCertificate = useSelector(tlsCertificateSelectors.get);
  const tlsCertificateLoaded = useSelector(tlsCertificateSelectors.loaded);
  const vaultEnabledLoaded = useSelector(vaultEnabledSelectors.loaded);
  useWindowTitle("Security");

  useEffect(() => {
    dispatch(generalActions.fetchTlsCertificate());
    dispatch(generalActions.fetchVaultEnabled());
  }, [dispatch]);

  if (!tlsCertificateLoaded || !vaultEnabledLoaded) {
    return <Spinner text="Loading..." />;
  }

  return (
    <>
      <Row>
        <Col size={6}>
          <h4>Security protocols</h4>
          {tlsCertificate ? <TLSEnabled /> : <TLSDisabled />}
        </Col>
      </Row>
      <Row>
        <Col size={6}>
          <h4>Secret storage</h4>
          <VaultSettings />
        </Col>
      </Row>
    </>
  );
};

export default Security;
