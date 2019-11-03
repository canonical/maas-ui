import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { config as configActions } from "app/settings/actions";
import { general as generalActions } from "app/base/actions";
import { config as configSelectors } from "app/settings/selectors";
import { general as generalSelectors } from "app/base/selectors";
import { useWindowTitle } from "app/base/hooks";
import { Col } from "@canonical/react-components";
import { Loader } from "@canonical/react-components";
import { Row } from "@canonical/react-components";
import DeployForm from "app/settings/views/Configuration/DeployForm";

const Deploy = () => {
  const configLoaded = useSelector(configSelectors.loaded);
  const configLoading = useSelector(configSelectors.loading);
  const osInfoLoaded = useSelector(generalSelectors.osInfo.loaded);
  const osInfoLoading = useSelector(generalSelectors.osInfo.loading);
  const loaded = configLoaded && osInfoLoaded;
  const loading = configLoading || osInfoLoading;
  const dispatch = useDispatch();

  useWindowTitle("Deploy");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
      dispatch(generalActions.fetchOsInfo());
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
