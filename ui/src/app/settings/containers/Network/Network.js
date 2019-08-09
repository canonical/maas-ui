import React from "react";
import { useSelector } from "react-redux";

import selectors from "app/settings/selectors";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import ProxyForm from "app/settings/containers/ProxyForm";
import Row from "app/base/components/Row";

const Network = () => {
  const loaded = useSelector(selectors.config.loaded);
  const loading = useSelector(selectors.config.loading);

  return (
    <>
      <h4>
        Network
        {loading && <Loader text="Loading..." inline />}
      </h4>
      {loaded && (
        <Row>
          <Col size={8}>
            <h5>Proxy</h5>
            <ProxyForm />
          </Col>
        </Row>
      )}
    </>
  );
};

export default Network;
