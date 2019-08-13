import React from "react";
import { useSelector } from "react-redux";

import config from "app/settings/selectors/config";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";

const SyslogForm = () => {
  const loaded = useSelector(config.loaded);
  const loading = useSelector(config.loading);

  return (
    <Row>
      <Col size={6}>
        {loading && <Loader text="Loading..." />}
        {loaded && <h4>Network discovery</h4>}
      </Col>
    </Row>
  );
};

export default SyslogForm;
