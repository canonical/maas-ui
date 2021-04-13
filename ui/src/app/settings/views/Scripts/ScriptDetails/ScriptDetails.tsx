import { useContext, useEffect, useRef } from "react";

import { Code, Col, Row, Spinner } from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import FileContext from "app/base/file-context";
import { actions as scriptActions } from "app/store/script";
import scriptSelectors from "app/store/script/selectors";
import type { Script } from "app/store/script/types";

type Props = {
  id: Script["id"];
};

const ScriptDetails = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const loading = useSelector(scriptSelectors.loading);
  const scriptKey = useRef(nanoid());
  const fileContext = useContext(FileContext);
  const script = fileContext.get(scriptKey.current);

  useEffect(() => {
    if (id) {
      dispatch(scriptActions.get(id, scriptKey.current));
    }
  }, [dispatch, id]);

  // Clean up the requested files when the component unmounts.
  useEffect(
    () => () => {
      fileContext.remove(scriptKey.current);
    },
    [fileContext]
  );

  if (loading) {
    return <Spinner />;
  }

  if (!script) {
    return <>Script could not be found</>;
  }

  return (
    <Row>
      <Col size="10">
        <Code className="u-no-margin--bottom">{script}</Code>
      </Col>
    </Row>
  );
};

export default ScriptDetails;
