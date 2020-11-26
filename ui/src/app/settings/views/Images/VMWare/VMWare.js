import { Col, Spinner, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { config as configActions } from "app/settings/actions";
import configSelectors from "app/store/config/selectors";
import { useWindowTitle } from "app/base/hooks";
import VMWareForm from "../VMWareForm";

const VMWare = () => {
  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const dispatch = useDispatch();

  useWindowTitle("VMWare");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text="Loading..." />}
        {loaded && <VMWareForm />}
      </Col>
    </Row>
  );
};

export default VMWare;
