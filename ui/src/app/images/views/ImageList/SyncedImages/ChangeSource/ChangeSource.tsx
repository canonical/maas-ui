import { useState } from "react";

import FetchImagesForm from "./FetchImagesForm";
import FetchedImages from "./FetchedImages";

import type { BootResourceUbuntuSource } from "app/store/bootresource/types";

type Props = {
  onCancel: (() => void) | null;
};

const ChangeSource = ({ onCancel }: Props): JSX.Element => {
  const [source, setSource] = useState<BootResourceUbuntuSource | null>(null);
  const [showTable, setShowTable] = useState(false);

  if (source && showTable) {
    return <FetchedImages setShowTable={setShowTable} source={source} />;
  }
  return (
    <FetchImagesForm
      onCancel={onCancel}
      setShowTable={setShowTable}
      setSource={setSource}
      source={source}
    />
  );
};

export default ChangeSource;
