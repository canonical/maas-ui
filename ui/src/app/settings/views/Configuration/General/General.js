import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";
import GeneralForm from "../GeneralForm";

const General = () => {
  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Loader text="Loading..." />}
        {loaded && <GeneralForm />}
      </Col>
    </Row>
  );
};

export default General;
