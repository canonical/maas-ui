import React from "react";
import { useSelector } from "react-redux";

import selectors from "app/settings/selectors";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";
import VMWareForm from "../VMWareForm";

const VMWare = () => {
  const loaded = useSelector(selectors.config.loaded);
  const loading = useSelector(selectors.config.loading);

  return (
    <Row>
      <Col size={6}>
        {loading && <Loader text="Loading..." />}
        {loaded && <VMWareForm />}
      </Col>
    </Row>
  );
};

export default VMWare;
