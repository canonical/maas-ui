import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import { actions as bootResourceActions } from "app/store/bootresource";
import type { BootResourceUbuntuSource } from "app/store/bootresource/types";

type Props = {
  setShowTable: (show: boolean) => void;
  source: BootResourceUbuntuSource;
};

const FetchedImages = ({ setShowTable, source }: Props): JSX.Element | null => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(bootResourceActions.clearFetchedImages());
    };
  }, [dispatch]);

  return (
    <div className="u-flex--between">
      <h4>
        Showing images fetched from <strong>{source.url || "maas.io"}</strong>
      </h4>
      <Button appearance="neutral" onClick={() => setShowTable(false)}>
        Change source
      </Button>
    </div>
  );
};

export default FetchedImages;
