import { useEffect } from "react";

import { Col, Row, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import TLSDisabled from "./TLSDisabled";
import TLSEnabled from "./TLSEnabled";

import { useWindowTitle } from "app/base/hooks";
import { actions as generalActions } from "app/store/general";
import { tlsCertificate as tlsCertificateSelectors } from "app/store/general/selectors";

const Security = (): JSX.Element => {
  const dispatch = useDispatch();
  const tlsCertificate = useSelector(tlsCertificateSelectors.get);
  const tlsCertificateLoaded = useSelector(tlsCertificateSelectors.loaded);
  useWindowTitle("Security");

  useEffect(() => {
    dispatch(generalActions.fetchTlsCertificate());
  }, [dispatch]);

  if (!tlsCertificateLoaded) {
    return <Spinner text="Loading..." />;
  }

  return (
    <Row>
      <Col size={6}>{tlsCertificate ? <TLSEnabled /> : <TLSDisabled />}</Col>
    </Row>
  );
};

export default Security;
