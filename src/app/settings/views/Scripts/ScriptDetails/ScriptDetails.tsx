import { useContext, useEffect, useRef } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import Button from "@/app/base/components/Button";
import CodeBlock from "@/app/base/components/CodeBlock";
import Spinner from "@/app/base/components/Spinner";
import FileContext from "@/app/base/file-context";
import { scriptActions } from "@/app/store/script";
import scriptSelectors from "@/app/store/script/selectors";
import type { Script } from "@/app/store/script/types";

type Props = {
  id: Script["id"];
};

const ScriptDetails = ({ id }: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const loading = useSelector(scriptSelectors.loading);
  const scriptKey = useRef(nanoid());
  const fileContext = useContext(FileContext);
  const script = fileContext.get(scriptKey.current);
  const { closeSidePanel } = useSidePanel();

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
    <>
      <CodeBlock>{script}</CodeBlock>
      <hr />
      <span className="u-flex--end">
        <Button appearance="base" onClick={closeSidePanel}>
          Close
        </Button>
      </span>
    </>
  );
};

export default ScriptDetails;
