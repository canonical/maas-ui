import { Col, Spinner, Row } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";

import { config as configActions } from "app/settings/actions";
import { general as generalActions } from "app/base/actions";
import configSelectors from "app/store/config/selectors";
import generalSelectors from "app/store/general/selectors";
import { useWindowTitle } from "app/base/hooks";
import CommissioningForm from "../CommissioningForm";

const Commissioning = () => {
  const configLoaded = useSelector(configSelectors.loaded);
  const configLoading = useSelector(configSelectors.loading);
  const osInfoLoaded = useSelector(generalSelectors.osInfo.loaded);
  const osInfoLoading = useSelector(generalSelectors.osInfo.loading);
  const loaded = configLoaded && osInfoLoaded;
  const loading = configLoading || osInfoLoading;
  const dispatch = useDispatch();

  useWindowTitle("Commissioning");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
      dispatch(generalActions.fetchOsInfo());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text="Loading..." />}
        {loaded && <CommissioningForm />}
      </Col>
    </Row>
  );
};

export default Commissioning;
