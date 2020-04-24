import { Col, Spinner, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { useWindowTitle } from "app/base/hooks";
import GeneralForm from "../GeneralForm";

const General = () => {
  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const dispatch = useDispatch();

  useWindowTitle("General");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text="Loading..." />}
        {loaded && <GeneralForm />}
      </Col>
    </Row>
  );
};

export default General;
