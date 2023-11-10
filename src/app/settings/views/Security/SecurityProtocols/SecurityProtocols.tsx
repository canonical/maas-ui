import { Col, Row, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TLSDisabled from "./TLSDisabled";
import TLSEnabled from "./TLSEnabled";

import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import { actions as generalActions } from "@/app/store/general";
import { tlsCertificate as tlsCertificateSelectors } from "@/app/store/general/selectors";

const SecurityProtocols = (): JSX.Element => {
  const tlsCertificate = useSelector(tlsCertificateSelectors.get);
  const tlsCertificateLoaded = useSelector(tlsCertificateSelectors.loaded);
  useWindowTitle("Security protocols");
  useFetchActions([generalActions.fetchTlsCertificate]);

  if (!tlsCertificateLoaded) {
    return <Spinner text="Loading..." />;
  }

  return (
    <>
      <Row>
        <Col size={6}>
          {!tlsCertificateLoaded ? (
            <Spinner text="Loading..." />
          ) : tlsCertificate ? (
            <TLSEnabled />
          ) : (
            <TLSDisabled />
          )}
        </Col>
      </Row>
    </>
  );
};

export default SecurityProtocols;
