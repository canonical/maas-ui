import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";
import WindowsForm from "../WindowsForm";

const Windows = () => {
  const loaded = useSelector(selectors.config.loaded);
  const loading = useSelector(selectors.config.loading);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!loaded) {
      dispatch(actions.config.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Loader text="Loading..." />}
        {loaded && <WindowsForm />}
      </Col>
    </Row>
  );
};

export default Windows;
