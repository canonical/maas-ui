import { useState } from "react";

import FetchImagesForm from "./FetchImagesForm";
import FetchedImages from "./FetchedImages";

import type { BootResourceUbuntuSource } from "app/store/bootresource/types";

type Props = {
  closeForm: () => void;
};

const ChangeSource = ({ closeForm }: Props): JSX.Element => {
  const [source, setSource] = useState<BootResourceUbuntuSource | null>(null);
  const [showTable, setShowTable] = useState(false);

  if (source && showTable) {
    return (
      <FetchedImages
        closeForm={closeForm}
        closeTable={() => setShowTable(false)}
        source={source}
      />
    );
  }
  return (
    <FetchImagesForm
      closeForm={closeForm}
      openTable={() => setShowTable(true)}
      setSource={setSource}
      source={source}
    />
  );
};

export default ChangeSource;
