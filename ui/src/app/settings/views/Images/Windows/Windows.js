import { Col, Spinner, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { useWindowTitle } from "app/base/hooks";
import WindowsForm from "../WindowsForm";

const Windows = () => {
  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const dispatch = useDispatch();

  useWindowTitle("Windows");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text="Loading..." />}
        {loaded && <WindowsForm />}
      </Col>
    </Row>
  );
};

export default Windows;
