import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";
import DeployForm from "app/settings/views/Configuration/DeployForm";

const Deploy = () => {
  const configLoaded = useSelector(selectors.config.loaded);
  const configLoading = useSelector(selectors.config.loading);
  const osInfoLoaded = useSelector(selectors.general.osInfo.loaded);
  const osInfoLoading = useSelector(selectors.general.osInfo.loading);
  const loaded = configLoaded && osInfoLoaded;
  const loading = configLoading || osInfoLoading;

  const dispatch = useDispatch();
  useEffect(() => {
    if (!loaded) {
      dispatch(actions.config.fetch());
      dispatch(actions.general.fetchOsInfo());
    }
  }, [dispatch, loaded]);

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
