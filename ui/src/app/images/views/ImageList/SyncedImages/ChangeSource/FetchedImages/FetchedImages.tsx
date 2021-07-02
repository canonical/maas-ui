import { Button } from "@canonical/react-components";

import type { BootResourceUbuntuSource } from "app/store/bootresource/types";

type Props = {
  onCancel: () => void;
  source: BootResourceUbuntuSource;
};

const FetchedImages = ({ onCancel, source }: Props): JSX.Element | null => {
  return (
    <div className="u-flex--between">
      <h4>
        Showing images fetched from <strong>{source.url || "maas.io"}</strong>
      </h4>
      <Button appearance="neutral" onClick={onCancel}>
        Change source
      </Button>
    </div>
  );
};

export default FetchedImages;
