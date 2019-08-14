import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";
import DeployForm from "app/settings/views/Configuration/DeployForm";

const Deploy = () => {
  const loaded = useSelector(selectors.config.loaded);
  const loading = useSelector(selectors.config.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.general.fetchOsInfo());
  }, [dispatch]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Loader text="Loading..." />}
        {loaded && <DeployForm />}
      </Col>
    </Row>
  );
};

export default Deploy;
